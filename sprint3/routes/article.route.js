import { Router } from "express";
import { prisma } from "../prisma/prisma.js";
import { validateArticle } from "../middlewares/validateArticle.js";

export const articleRouter = Router();

// 게시글 등록
articleRouter.post("/", validateArticle, async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const post = await prisma.article.create({
      data: { title, content },
    });

    res.status(201).json(post);
  } catch (e) {
    next(e);
  }
});

// 목록 조회
articleRouter.get("/", async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const keyword = req.query.keyword;

    const where = keyword
      ? {
          OR: [
            { title: { contains: keyword } },
            { content: { contains: keyword } },
          ],
        }
      : {};

    const posts = await prisma.article.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: "desc" },
    });

    res.json(posts);
  } catch (e) {
    next(e);
  }
});

// 상세 조회
articleRouter.get("/:id", async (req, res, next) => {
  try {
    const post = await prisma.article.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!post) return res.status(404).json({ error: "게시글 없음" });

    res.json(post);
  } catch (e) {
    next(e);
  }
});

// 수정
articleRouter.patch("/:id", validateArticle, async (req, res, next) => {
  try {
    const updated = await prisma.article.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });

    res.json(updated);
  } catch (e) {
    next(e);
  }
});

// 삭제
articleRouter.delete("/:id", async (req, res, next) => {
  try {
    await prisma.article.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});
