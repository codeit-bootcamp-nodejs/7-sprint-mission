import { Router } from "express";
import { prisma } from "../prisma/prisma.js";
import multer from "multer";
import _path from "path";
import fs from "fs/promises";
import { BadRequestError, NotFoundError } from "../utils/CustomError.js";

const articleImageRouter = new Router({ mergeParams: true });

// routes/image.js
const upload = multer({
  storage: multer.diskStorage({
    // 사용자별 폴더 생성
    destination: async function (req, file, cb) {
      const uploadDir = _path.join(
        "uploads",
        "images",
        "articles",
        req.params.articleId
      );

      // 폴더가 없으면 생성
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      // 프로필 사진은 하나만: image + 타임스탬프 + 확장자
      const articleId = req.params.articleId;
      const ext = _path.extname(file.originalname);
      cb(null, `${articleId}-${Date.now()}${ext}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: function (req, file, cb) {
    // 이미지 파일만 허용
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      _path.extname(file.originalname).toLowerCase()
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
articleImageRouter
  .route("/")
  .post(upload.single("image"), async (req, res, next) => {
    try {
      if (!req.file) {
        throw new BadRequestError("파일이 업로드되지 않았습니다");
      }

      const { filename: name, path, size } = req.file;

      const { image, image_id, ...articleEntity } =
        await prisma.article.findUnique({
          where: { id: req.params.articleId },
          include: {
            image: true,
          },
        });
      console.log(articleEntity);

      const newImageEntity = {
        name,
        path,
        size,
      };

      const newarticleEntity = await prisma.article.update({
        where: { id: articleEntity.id },
        data: {
          ...articleEntity,
          image: {
            create: newImageEntity,
          },
        },
      });

      console.log(newarticleEntity);

      res.json({
        message: "프로필 이미지 업로드 성공",
        file: {
          name,
          path,
          size,
          url: _path.join(path),
        },
      });
    } catch (err) {
      next(err);
    }
  })
  .get(async (req, res, next) => {
    // 프로필 이미지 조회
    try {
      const { articleId } = req.params;
      const {
        image: { name, path },
      } = await prisma.article.findUnique({
        where: { id: articleId },
        include: {
          image: true,
        },
      });

      res.sendFile(
        // 절대 경로 필요
        _path.join(import.meta.dirname, "..", path)
      );
    } catch (err) {
      if (err.code === "ENOENT") {
        next(
          new NotFoundError(`제품 ${articleId}의 이미지를 찾을 수 없습니다`)
        );
      }
      next(err);
    }
  });

export default articleImageRouter;
