import express from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";

const router = express.Router();
const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const wrap = (handler) => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Server Error" });
  }
};

router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).send({ message: "파일 없음" });
  const imagePath = req.file.path.replace(/\\/g, "/");
  res.json({ url: `http://localhost:3000/${imagePath}` });
});

router.post(
  "/",
  wrap(async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content)
      return res.status(400).send({ message: "내용 필수" });

    const newArticle = await prisma.article.create({
      data: { title, content },
    });
    res.status(201).send(newArticle);
  })
);

router.get(
  "/",
  wrap(async (req, res) => {
    const { page = 1, pageSize = 10, search = "" } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);

    const articles = await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      },

      orderBy: { createdAt: "desc" },
      skip,
      take: Number(pageSize),
    });
    res.send(articles);
  })
);

router.get(
  "/:id",
  wrap(async (req, res) => {
    const article = await prisma.article.update({
      where: { id: Number(req.params.id) },
      data: { viewCount: { increment: 1 } },
    });
    res.send(article);
  })
);

router.delete(
  "/:id",
  wrap(async (req, res) => {
    await prisma.article.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  })
);

router.patch(
  "/:id/like",
  wrap(async (req, res) => {
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: { likeCount: { increment: 1 } }, // 1 증가
    });
    res.send(product); // 업데이트된 정보(좋아요 수 포함) 돌려줌
  })
);

export default router;
