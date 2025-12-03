import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const userId = req.user?.id || "anonymous";
    const uploadPath = path.join("uploads", "profiles", userId.toString());
    await fs.mkdir(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // 프로필 사진은 하나만: profile + 타임스탬프 + 확장자
    const ext = path.extname(file.originalname);
    cb(null, `profile-${Date.now()}${ext}`);
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
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(
        new Error("이미지 파일만 업로드 가능합니다 (jpeg, jpg, png, gif, webp)")
      );
    }
  },
});

router.post(
  "/upload",
  upload.single("profileImage"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "파일이 업로드되지 않았습니다" });
      }

      // 이전 프로필 이미지 삭제 (있다면)
      const userId = req.user?.id || "anonymous";
      const uploadDir = path.join("uploads", "profiles", userId.toString());
      const files = await fs.readdir(uploadDir);

      for (const file of files) {
        if (file !== path.basename(req.file.path)) {
          await fs.unlink(path.join(uploadDir, file));
        }
      }

      res.json({
        message: "프로필 이미지 업로드 성공",
        file: {
          filename: req.file.filename,
          path: req.file.path,
          size: req.file.size,
          url: `/uploads/profiles/${userId}/${req.file.filename}`,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);
