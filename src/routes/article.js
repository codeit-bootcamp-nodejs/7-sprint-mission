import express from "express";
import { prisma } from "../../prisma/prisma.js";
import {
  validateArticleInfo,
  validateBigIntId,
  validateArticleUpdateInfo,
} from "../middlewares/validator.js";
import { getArticleList } from "../services/articleService.js";
import articleCommentRouter from "./articleComment.js";

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

// comment POST
router.post("/", validateArticleInfo, async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const newEntity = await prisma.article.create({ data: { title, content } });
    const article = Article.fromEntity(newEntity);
    res.status(201).json(article);
  } catch (e) {
    console.error("게시글 생성 중 오류:", e);
    next(e);
  }
});

// comment GET
router.get("/", async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const keyword = req.query.keyword;

    const { articles, totalCount } = await getArticleList(
      limit,
      offset,
      keyword
    );

    res.json({ articles, totalCount });
  } catch (e) {
    console.error("게시글 목록 조회 중 오류:", e);
    next(e);
  }
});

// comment GET 살세
router.get("/:id", validateBigIntId, async (req, res, next) => {
  try {
    const articleId = req.params.id;
    const entity = await prisma.article.findUnique({
      where: { id: BigInt(articleId) },
    });

    if (!entity) {
      return res
        .status(404)
        .json({ message: `ID ${articleId}를 가진 게시글을 찾을 수 없습니다.` });
    }

    const article = Article.fromEntity(entity);
    res.json(article);
  } catch (e) {
    console.error("게시글 상세 조회 중 오류:", e);
    next(e);
  }
});

// comment PATCH
router.patch(
  "/:id",
  validateBigIntId,
  validateArticleUpdateInfo,
  async (req, res, next) => {
    const articleId = req.params.id;

    try {
      const { title, content } = req.body;
      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (content !== undefined) updateData.content = content;

      const updatedEntity = await prisma.article.update({
        where: { id: BigInt(articleId) },
        data: updateData,
      });

      const article = Article.fromEntity(updatedEntity);
      res.json(article);
    } catch (e) {
      console.error("게시글 수정 중 오류 : ", e);
      if (e.code === "P2025") {
        return res.status(404).json({
          message: `ID ${articleId}를 가진 게시글을 찾을 수 없습니다.`,
        });
      }
      next(e);
    }
  }
);

// comment DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    const articleId = req.params.id;
    await prisma.article.delete({ where: { id: BigInt(articleId) } });
    res.status(204).send(); // 204 No Content
  } catch (e) {
    console.error("게시글 삭제 중 오류 : ", e);
    next(e);
  }
});

// Comment 라우터 마운트 (GET, POST, PATCH, DELETE)
router.use("/:id/comments", validateBigIntId, articleCommentRouter);

export default router;
