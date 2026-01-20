import { Router } from "express";
import { prisma } from "../../prisma/prisma.js";
import multer from "multer";
import _path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { BadRequestError, NotFoundError } from "../exceptions/errors.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = _path.dirname(__filename);
const projectRoot = _path.join(__dirname, "..", "..");

const productImageRouter = Router({ mergeParams: true });

// Multer 설정
const upload = multer({
  storage: multer.diskStorage({
    // 사용자별 폴더 생성
    destination: async function (req, file, cb) {
      try {
        const productId = req.params.productId;

        if (!productId) {
          return cb(new Error("Product ID is missing in the URL path."));
        }

        const uploadDir = _path.join(
          projectRoot,
          "uploads",
          "images",
          "products",
          productId
        );

        await fs.mkdir(uploadDir, { recursive: true });
        cb(null, uploadDir);
      } catch (error) {
        cb(error);
      }
    },
    filename: function (req, file, cb) {
      const productId = req.params.productId;
      const ext = _path.extname(file.originalname);
      cb(null, `${productId}-${Date.now()}${ext}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      _path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(
        new BadRequestError(
          "이미지 파일만 업로드 가능합니다 (jpeg, jpg, png, gif, webp)"
        )
      );
    }
  },
});

// 이미지 업로드 및 등록/교체
productImageRouter
  .route("/")
  .post(upload.single("image"), async (req, res, next) => {
    const productId = BigInt(req.params.productId);

    try {
      if (!req.file) {
        throw new BadRequestError("파일이 업로드되지 않았습니다");
      }

      const { filename: name, path: absolutePath, size } = req.file;

      const relativePath = absolutePath.substring(projectRoot.length + 1);

      const existingProduct = await prisma.product.findUnique({
        where: { id: productId },
        include: { image: true },
      });

      if (!existingProduct) {
        await fs.unlink(absolutePath).catch(() => {});
        throw new NotFoundError(`제품 ID ${productId}를 찾을 수 없습니다.`);
      }

      if (existingProduct.image) {
        const oldImagePath = _path.join(
          projectRoot,
          existingProduct.image.path
        );
        await fs.unlink(oldImagePath).catch(console.error);

        await prisma.product_image.delete({
          where: { id: existingProduct.image.id },
        });
      }

      const newImageEntity = {
        name,
        path: relativePath,
        size,
      };

      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: {
          image: {
            create: newImageEntity,
          },
        },
        include: { image: true },
      });

      res.json({
        message: "제품 이미지 업로드 및 교체 성공",
        file: {
          name,
          path: relativePath,
          size,
          url: `/products/${productId}/image`,
        },
      });
    } catch (err) {
      if (req.file) {
        await fs.unlink(req.file.path).catch(() => {});
      }
      next(err);
    }
  })

  // 이미지 조회
  .get(async (req, res, next) => {
    const productId = BigInt(req.params.productId);

    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { image: true },
      });

      if (!product || !product.image) {
        throw new NotFoundError(
          `제품 ID ${productId}의 이미지를 찾을 수 없습니다`
        );
      }

      const absolutePath = _path.join(projectRoot, product.image.path);

      res.sendFile(absolutePath);
    } catch (err) {
      if (err.code === "ENOENT" || err instanceof NotFoundError) {
        next(
          new NotFoundError(`제품 ${productId}의 이미지를 찾을 수 없습니다.`)
        );
      } else {
        next(err);
      }
    }
  });

export default productImageRouter;
