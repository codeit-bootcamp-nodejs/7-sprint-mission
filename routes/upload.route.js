import express from "express";
import { upload } from "../middlewares/upload.js";
import { asyncHandler } from "../asyncHandler.js";

const router = express.Router();

router.post(
  "/image",
  upload.single("image"), // 'image'라는 필드명으로 파일 수신
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 업로드된 파일의 접근 URL 생성
    // 실제 운영 환경에서는 도메인/스토리지 URL 등을 고려해야 함
    const fileUrl = `/uploads/${req.file.filename}`;

    res.status(201).json({
      id: req.file.filename, // 간단히 파일명을 ID로 사용하거나 DB에 저장 후 ID 반환 가능
      url: fileUrl,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
  })
);

export default router;
