import { Router } from "express";
import { prisma } from "../prisma/prisma.js";

export const commentRouter = Router();

// =========================
// Product 댓글
// =========================

// 등록
commentRouter.post("/product/:id", async (req, res, next) => {
  try {
    const product_id = Number(req.params.id);
    const { content } = req.body;

    const comment = await prisma.product_comment.create({
      data: { content, product_id },
    });

    res.status(201).json(comment);
  } catch (e) {
    next(e);
  }
});

// 목록 (cursor)
commentRouter.get("/product/:id", async (req, res, next) => {
  try {
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const take = 10;

    const comments = await prisma.product_comment.findMany({
      where: { product_id: Number(req.params.id) },
      take,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { id: "asc" },
    });

    res.json({
      comments,
      nextCursor:
        comments.length === take ? comments[comments.length - 1].id : null,
    });
  } catch (e) {
    next(e);
  }
});

// 수정
commentRouter.patch("/product/comment/:id", async (req, res, next) => {
  try {
    const updated = await prisma.product_comment.update({
      where: { id: Number(req.params.id) },
      data: { content: req.body.content },
    });

    res.json(updated);
  } catch (e) {
    next(e);
  }
});

// 삭제
commentRouter.delete("/product/comment/:id", async (req, res, next) => {
  try {
    await prisma.product_comment.delete({
      where: { id: Number(req.params.id) },
    });

    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

// =========================
// Article 댓글
// =========================

commentRouter.post("/article/:id", async (req, res, next) => {
  try {
    const article_id = Number(req.params.id);
    const { content } = req.body;

    const comment = await prisma.article_comment.create({
      data: { content, article_id },
    });

    res.status(201).json(comment);
  } catch (e) {
    next(e);
  }
});

commentRouter.get("/article/:id", async (req, res, next) => {
  try {
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const take = 10;

    const comments = await prisma.article_comment.findMany({
      where: { article_id: Number(req.params.id) },
      take,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { id: "asc" },
    });

    res.json({
      comments,
      nextCursor:
        comments.length === take ? comments[comments.length - 1].id : null,
    });
  } catch (e) {
    next(e);
  }
});

// 수정
commentRouter.patch("/article/comment/:id", async (req, res, next) => {
  try {
    const updated = await prisma.article_comment.update({
      where: { id: Number(req.params.id) },
      data: { content: req.body.content },
    });

    res.json(updated);
  } catch (e) {
    next(e);
  }
});

// 삭제
commentRouter.delete("/article/comment/:id", async (req, res, next) => {
  try {
    await prisma.article_comment.delete({
      where: { id: Number(req.params.id) },
    });

    res.status(204).send();
  } catch (e) {
    next(e);
  }
});
