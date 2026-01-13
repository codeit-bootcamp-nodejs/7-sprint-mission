import express from "express";
import { prisma } from "../../prisma/prisma.js";
import { ArticleComment } from "./comment.js";
import {
  validateArticleCommentInfo,
  validateGetComments,
  validateCommentId,
} from "../middlewares/validator.js";
import { createArticleComment } from "../services/articleService.js";
import { BadRequestError } from "../exceptions/errors.js";

const articleCommentRouter = express.Router({ mergeParams: true });

// comment GET (CUSOR)
articleCommentRouter.get("/", validateGetComments, async (req, res, next) => {
  try {
    const articleId = req.params.id;
    const { cursor, limit = "10" } = req.query;
    const take = parseInt(limit);

    if (isNaN(take) || take <= 0) {
      throw new BadRequestError("유효하지 않은 limit 값입니다.");
    }
    const orderBy = [{ created_at: "desc" }, { id: "asc" }];
    const baseConditions = [{ article_id: BigInt(articleId) }];

    let cursorWhere = [];
    let nextCursor = null;

    if (cursor) {
      const [cursorCreatedAtStr, cursorIdStr] = cursor.split("_");

      if (cursorCreatedAtStr && cursorIdStr) {
        const cursorCreatedAt = new Date(cursorCreatedAtStr);
        const cursorId = BigInt(cursorIdStr);

        cursorWhere = [
          {
            OR: [
              {
                created_at: { lt: cursorCreatedAt },
              },
              {
                AND: [
                  { created_at: cursorCreatedAt },
                  { id: { gt: cursorId } },
                ],
              },
            ],
          },
        ];
      } else {
        throw new BadRequestError("잘못된 커서 형식입니다.");
      }
    }

    const whereConditions = baseConditions.concat(cursorWhere);

    const where = { AND: whereConditions };

    const entities = await prisma.article_comment.findMany({
      where,
      orderBy,
      take: take + 1,
    });

    const hasNext = entities.length > take;
    const items = hasNext ? entities.slice(0, take) : entities;

    if (hasNext) {
      const lastItem = items[items.length - 1];
      const lastCreatedAt = lastItem.created_at.toISOString();
      const lastId = lastItem.id.toString();
      nextCursor = `${lastCreatedAt}_${lastId}`;
    } else {
      nextCursor = null;
    }

    const articleComments = items.map(ArticleComment.fromEntity);

    res.json({ data: articleComments, nextCursor, hasNext });
  } catch (e) {
    next(e);
  }
});

// comment POST
articleCommentRouter.post(
  "/",
  validateArticleCommentInfo,
  async (req, res, next) => {
    const articleId = req.params.id;
    const { content } = req.body;

    try {
      const newEntity = await createArticleComment(articleId, content);
      const articleComment = ArticleComment.fromEntity(newEntity);
      res.status(201).json(articleComment);
    } catch (e) {
      console.error("게시글 댓글 등록 중 오류:", e);
      next(e);
    }
  }
);

// comment PATCH
articleCommentRouter.patch(
  "/:commentId",
  validateCommentId,
  validateArticleCommentInfo,
  async (req, res, next) => {
    const articleId = req.params.id;
    const commentId = req.params.commentId;
    const { content } = req.body;

    try {
      const updatedEntity = await prisma.article_comment.update({
        where: { id: BigInt(commentId), article_id: BigInt(articleId) },
        data: { content },
      });

      const articleComment = ArticleComment.fromEntity(updatedEntity);
      res.status(200).json(articleComment);
    } catch (e) {
      console.error(`댓글 ID ${commentId} 수정 중 오류:`, e);

      if (e.code === "P2025") {
        return res.status(404).json({
          message: `게시글 ID ${articleId}에서 댓글 ID ${commentId}를 찾을 수 없습니다.`,
        });
      }

      next(e);
    }
  }
);

// comment DELETE
articleCommentRouter.delete(
  "/:commentId",
  validateCommentId,
  async (req, res, next) => {
    const articleId = req.params.id;
    const commentId = req.params.commentId;

    try {
      await prisma.article_comment.delete({
        where: {
          id: BigInt(commentId),
          article_id: BigInt(articleId),
        },
      });

      res.status(204).send();
    } catch (e) {
      console.error(`댓글 ID ${commentId} 삭제 중 오류:`, e);

      if (e.code === "P2025") {
        return res.status(404).json({
          message: `게시글 ID ${articleId}에서 댓글 ID ${commentId}를 찾을 수 없습니다.`,
        });
      }

      next(e);
    }
  }
);

export default articleCommentRouter;
