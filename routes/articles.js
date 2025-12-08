import express from "express";
import { prisma } from "../prisma/prisma.js";
import { asyncHandler } from "../asyncHandler.js";
import { HTTPError } from "../error.js";

const router = express.Router();

class Article {
  constructor(id, title, content, createdAt) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
  }

  static fromEntity(entity) {
    return new Article(
      entity.id.toString(),
      entity.title,
      entity.content,
      entity.created_at
    );
  }
}

// 게시글 목록 조회
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { offset = 0, limit = 10, sort = "recent", keyword = "" } = req.query;
    const skip = parseInt(offset, 10);
    const take = parseInt(limit, 10);

    if (isNaN(skip) || isNaN(take) || skip < 0 || take < 1) {
      throw new HTTPError(400, "Offset and limit must be valid numbers");
    }

    const orderBy =
      sort === "recent" ? { created_at: "desc" } : { created_at: "desc" };

    const articles = await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: keyword } },
          { content: { contains: keyword } },
        ],
      },
      skip,
      take,
      orderBy,
    });
    res
      .status(200)
      .json(articles.map((article) => Article.fromEntity(article)));
  })
);

// 게시글 등록
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { title, content } = req.body;

    if (!title || typeof title !== "string") {
      throw new HTTPError(400, "Title is required and must be a string");
    }

    if (!content || typeof content !== "string") {
      throw new HTTPError(400, "Content is required and must be a string");
    }

    const article = await prisma.article.create({
      data: { title, content },
    });
    res.status(201).json(Article.fromEntity(article));
  })
);

// 게시글 상세 조회
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      throw new HTTPError(404, "Article not found");
    }

    res.status(200).json(Article.fromEntity(article));
  })
);

// 게시글 수정
router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    if (isNaN(id)) {
      throw new HTTPError(400, "ID must be a number");
    }

    if (title !== undefined && typeof title !== "string") {
      throw new HTTPError(400, "Title must be a string");
    }

    if (content !== undefined && typeof content !== "string") {
      throw new HTTPError(400, "Content must be a string");
    }

    const article = await prisma.article.update({
      where: { id },
      data: { title, content },
    });
    res.status(200).json(Article.fromEntity(article));
  })
);

// 게시글 삭제
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
      throw new HTTPError(400, "ID must be a number");
    }

    const article = await prisma.article.delete({
      where: { id },
    });
    res.status(200).json(Article.fromEntity(article));
  })
);

export default router;
