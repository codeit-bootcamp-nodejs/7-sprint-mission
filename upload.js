// 1. multer 설치 및 설정 파일(config/multer.js) 작성.

// 2. **diskStorage**를 사용하여 서버에 파일 저장 설정 (uploads 폴더 등) 및 **fileFilter**를 이용한 이미지 파일 필터링 로직 구현.

// 3. 라우터(routes/upload.js)에 upload.single('image') 미들웨어를 사용하는 POST /upload/image API 구현.

// 4. req.file 객체의 정보를 활용하여 저장된 이미지의 URL 경로를 응답으로 반환.

import multer from "multer";
import Router from "express";
import path from "path";
import fs from "fs/promises";
const imageRouter = new Router();
// 사용자별 폴더 생성
const storage = multer.diskStorage({
   // 멀티파트 업로드가 완료되면 나한테 이렇게 저장할래
   destination: async function (req, file, cb) {
      const userId = req.user?.id || "anonymous";
      const uploadPath = path.join("uploads", "profiles", userId.toString());
      //path.join("uploads", "profiles", userId.toString()) : /로 각 요소들을 붙여라
      //uploads/profiles/userId

      // 폴더가 없으면 생성
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
   },
   filename: function (req, file, cb) {
      // 프로필 사진은 하나만: profile + 타임스탬프 + 확장자
      const ext = path.extname(file.originalname);
      cb(null, `profile-${Date.now()}${ext}`); // timeStamp를 다 찍어주기 때문에 파일이 겹쳐지지 않는다 => tie breaker(동점이 발생했을 때, 순위 결정을 위해 사용되는 추가적인 규칙이나 방식)
   },
});

const upload = multer({
   storage: storage,
   limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
   },
   fileFilter: function (req, file, cb) {
      // 이미지 파일만 허용
      const allowedTypes = /jpeg|jpg|png|gif|webp/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);

      if (extname && mimetype) {
         cb(null, true);
      } else {
         // 🚨 4. Error 객체 대신 클라이언트가 처리할 수 있도록 400 Bad Request 에러를 next로 전달할 수도 있지만,
         // multer의 fileFilter는 표준적으로 Error 객체를 사용합니다. 이대로 유지합니다.
         cb(new Error("이미지 파일만 업로드 가능합니다 (jpeg, jpg, png, gif, webp)"));
      }
   },
});

// 프로필 이미지 업로드
imageRouter.post("/", upload.single("image"), async (req, res, next) => {
   // 🚨 5. 경로를 '/uploads'로, 필드 이름을 'image'로 변경
   // upload.single("image") => image가 필드인 한 파일을 업로드할거다.
   try {
      if (!req.file) {
         // multer에서 에러가 발생하지 않고 파일이 없는 경우 400 처리
         return res.status(400).json({ error: "파일이 업로드되지 않았습니다" });
      }

      // 이전 프로필 이미지 삭제 (있다면)
      // 있으면 id, 없으면 anonymous
      const userId = req.user?.id || "anonymous";
      const uploadDir = path.join("uploads", "profiles", userId.toString());
      // 업로드된 파일의 최종 이름
      const uploadedFileName = req.file.filename;
      // 폴더 내 모든 파일 목록을 가져와서 현재 업로드된 파일을 제외하고 삭제
      const files = await fs.readdir(uploadDir);

      for (const file of files) {
         if (file !== uploadedFileName && file.startsWith("profile-")) {
            // 이전 파일과 현재 파일을 비교하고 'profile-' 접두사가 붙은 파일만 삭제
            // 현재 업로드된 파일과 이름이 다르고
            // 'profile-'로 시작하는 파일만 삭제 (안전성 확보)
            await fs.unlink(path.join(uploadDir, file));
         }
      }
      // 저장된 이미지의 URL 경로를 응답으로 반환
      res.status(201).json({
         // 201 Created 응답
         message: "프로필 이미지 업로드 성공",
         file: {
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size,
            // URL 경로는 app.js에서 정적 경로로 설정되어야 한다.
            url: `/uploads/profiles/${userId}/${req.file.filename}`,
         },
      });
   } catch (err) {
      // multer 에러 처리
      if (err instanceof multer.MulterError) {
         return res.status(400).json("올바르지 않은 파일 형식입니다.");
      }
      next(err);
   }
});

// 프로필 이미지 조회
imageRouter.get("/:userId", async (req, res, next) => {
   try {
      const { userId } = req.params;
      const uploadDir = path.join("uploads", "profiles", userId);

      const files = await fs.readdir(uploadDir);
      const profileImage = files.find((file) => file.startsWith("profile-"));

      if (!profileImage) {
         return res.status(404).json({ error: "프로필 이미지를 찾을 수 없습니다" });
      }

      res.json({
         url: `/uploads/profiles/${userId}/${profileImage}`,
      });
   } catch (err) {
      if (err.code === "ENOENT") {
         return res.status(404).json({ error: "프로필 이미지를 찾을 수 없습니다" });
      }
      next(err);
   }
});

export default imageRouter;
