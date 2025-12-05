import { Router } from "express";
import { prisma } from "../prisma/prisma.js";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { BadRequestError, NotFoundError } from "../utils/CustomErrors.js";

const productImageRouter = new Router({ mergeParams: true });

// routes/image.js
const upload = multer({
  storage: multer.diskStorage({
    // 사용자별 폴더 생성
    destination: function (req, file, cb) {
      const productId = req.params.productId;
      if (!productId) {
        return cb(
          new Error("라우트 매개변수 (productId)가 누락되었습니다."),
          null
        );
      }

      const uploadDir = path.join("uploads", "images", "products", productId);

      // 폴더가 없으면 생성
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      cb(null, uploadDir);
    },

    filename: function (req, file, cb) {
      // 프로필 사진은 하나만: image + 타임스탬프 + 확장자
      const productId = req.params.productId;
      if (!productId) {
        return cb(new Error("ProductId가 없습니다."), null);
      }
      const ext = path.extname(file.originalname);
      cb(null, `${productId}-${Date.now()}${ext}`);
    },
  }),
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

// 프로필 이미지 업로드
productImageRouter
  .route("/")
  .post(upload.single("image"), async (req, res, next) => {
    try {
      if (!req.file) {
        throw new BadRequestError("파일이 업로드되지 않았습니다");
      }

      const { filename: name, path, size } = req.file;

      const { image, image_id, ...productEntity } =
        await prisma.product.findUnique({
          where: { id: req.params.productId },
          include: {
            image: true,
          },
        });
      console.log(productEntity);

      const newImageEntity = {
        name,
        path,
        size,
      };

      const newProductEntity = await prisma.product.update({
        where: { id: productEntity.id },
        data: {
          ...productEntity,
          image: {
            create: newImageEntity,
          },
        },
      });

      console.log(newProductEntity);

      res.json({
        message: "프로필 이미지 업로드 성공",
        file: {
          name,
          path,
          size,
          url: path.join(path),
        },
      });
    } catch (err) {
      next(err);
    }
  })
  .get(async (req, res, next) => {
    // 프로필 이미지 조회
    try {
      const { productId } = req.params;
      const {
        image: { name, path },
      } = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          image: true,
        },
      });

      res.sendFile(
        // 절대 경로 필요
        path.join(import.meta.dirname, "..", path)
      );
    } catch (err) {
      if (err.code === "ENOENT") {
        next(
          new NotFoundError(`제품 ${productId}의 이미지를 찾을 수 없습니다`)
        );
      }
      next(err);
    }
  });

export default productImageRouter;
