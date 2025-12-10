import multer from "multer";
import path from "path";
import fs from "fs";

// uploads 폴더가 없으면 생성
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 파일명 충돌 방지를 위해 타임스탬프 + 랜덤숫자 + 원본확장자 조합 사용
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // 이미지 파일만 허용 (jpeg, png, gif)
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/gif" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    // 에러 객체를 전달하여 Multer 에러 핸들링 유도
    const error = new Error("Only image files are allowed!");
    error.code = "LIMIT_FILE_TYPES";
    cb(error, false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB 제한
  },
});
