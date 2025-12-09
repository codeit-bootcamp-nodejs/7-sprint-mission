import express from "express";
import upload from "../config/multer.js";

const router = express.Router();

router.post("/image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "파일이 업로드되지 않았습니다." });
  }
  // 업로드된 이미지의 URL 반환
  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(201).json({ url: imageUrl });
});

export default router;
