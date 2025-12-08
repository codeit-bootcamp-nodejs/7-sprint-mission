// routes/product-image.route.js
import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { prisma } from "../prisma/prisma.js";

export const productImageRouter = Router();

const UPLOAD_DIR = "uploads";

// 업로드 폴더 없으면 생성
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const upload = multer({
  dest: UPLOAD_DIR,
});

// POST /products/:id/image
productImageRouter.post(
  "/:id/image",
  upload.single("image"),
  async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      if (!req.file) {
        return res.status(400).json({ error: "image 파일이 필요합니다." });
      }

      // 서버에 저장된 파일 경로
      const imagePath = `/${UPLOAD_DIR}/${req.file.filename}`;

      // DB에 이미지 경로 저장
      const updated = await prisma.product.update({
        where: { id },
        data: {
          image: imagePath,
        },
      });

      res.status(201).json({
        message: "이미지 업로드 성공",
        imageUrl: imagePath,
        product: updated,
      });
    } catch (e) {
      if (e.code === "P2025") {
        return res.status(404).json({ error: "상품을 찾을 수 없습니다." });
      }
      next(e);
    }
  }
);
