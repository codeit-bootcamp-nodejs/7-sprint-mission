import { Router } from "express";
import {
  orderByToSort,
  createContinuationToken,
  parseContinuationToken,
  buildCursorWhere,
} from "../utils/cursor-pagination.js";
import { prisma } from "../prisma/prisma.js";
import { ArticleComment } from "./comment.js";
import {
  deleteComment,
  updateComment,
} from "../services/article_commentService.js";
import { BadRequestError, NotFoundError } from "../utils/CustomErrors.js";

const articleCommentRouter = new Router({ mergeParams: true });

// - 댓글 등록 API를 만들어 주세요.
// /articles/:articleId/comments/ POST
//     - `content`를 입력하여 댓글을 등록합니다.
//     - 중고마켓, 자유게시판 댓글 등록 API를 따로 만들어 주세요.
articleCommentRouter.post("/", validateContentRequired, async (req, res) => {
  try {
    const { content } = req.body;
    const articleId = parseInt(req.params.articleId, 10);

    if (isNaN(articleId)) {
      throw new BadRequestError("유효하지 않은 상품 ID입니다.");
    }
    const created = await prisma.article_comment.create({
      data: {
        content,
        article_id: articleId,
      },
    });
    const articleComment = ArticleComment.fromEntity(created);
    res.status(201).json(articleComment);
  } catch (e) {
    next(e);
  }
});

articleCommentRouter.get("/", async (req, res, next) => {
  // - 댓글 목록 조회 API를 만들어 주세요.
  // /articles/:articleId/comments/ GET
  //     - `id`, `content`, `createdAt` 를 조회합니다.
  //     - cursor 방식의 페이지네이션 기능을 포함해 주세요.

  try {
    const { cursor, limit = "10" } = req.query;
    const take = parseInt(limit);

    if (isNaN(take) || take <= 0) {
      throw new BadRequestError("유효하지 않은 limit 값입니다.");
    }

    // 정렬 기준: created_at DESC, id ASC
    const orderBy = [{ created_at: "desc" }, { id: "asc" }];
    const sort = orderByToSort(orderBy);

    // cursor token 파싱
    const cursorToken = parseContinuationToken(cursor);
    const cursorWhere = cursorToken
      ? buildCursorWhere(cursorToken.data, cursorToken.sort)
      : {};

    // 기본 where 조건 (article_id 필터)
    const baseWhere = {
      article_id: req.params.articleId,
    };

    // cursor 조건과 기본 조건 병합
    const where =
      Object.keys(cursorWhere).length > 0
        ? { AND: [baseWhere, cursorWhere] }
        : baseWhere;

    // limit + 1개를 조회하여 다음 페이지 존재 여부 확인
    const entities = await prisma.article_comment.findMany({
      where,
      orderBy,
      take: take + 1,
    });

    // 다음 페이지가 있는지 확인
    const hasNext = entities.length > take;
    const items = hasNext ? entities.slice(0, take) : entities;

    // 다음 페이지를 위한 continuation token 생성
    const lastElemCursor = createContinuationToken(
      {
        id: items[items.length - 1].id,
        created_at: items[items.length - 1].created_at,
      },
      sort
    );

    const articleComments = items.map(ArticleComment.fromEntity);

    res.json({
      data: articleComments,
      lastElemCursor,
      hasNext,
    });
  } catch (e) {
    next(e);
  }
});

// - 댓글 수정 API를 만들어 주세요.
// /articles/:articleId/comments/:commentId PATCH
//     - `PATCH` 메서드를 사용해 주세요.
articleCommentRouter.patch(
  "/:commentId",
  validateContentRequired,
  validateCommentIdParam,
  async (req, res, next) => {
    try {
      const { content } = req.body || {};
      const { commentId } = req.params;

      // updatedEntity가 없으면 P2025 에러가 throw되어 catch로 이동 -> errorHandler(404)
      const updatedEntity = await updateComment(commentId, { content });

      const articleComment = ArticleComment.fromEntity(updatedEntity);
      res.status(200).json(articleComment);
    } catch (e) {
      next(e);
    }
  }
);

// - 댓글 삭제 API를 만들어 주세요.
// /articles/:articleId/comments/:commentId DELETE
articleCommentRouter.delete(
  "/:commentId",
  validateCommentIdParam,
  async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const deletedEntity = await deleteComment(commentId);

      const articleComment = ArticleComment.fromEntity(deletedEntity);

      res.status(200).json(articleComment);
    } catch (e) {
      next(e);
    }
  }
);

export default articleCommentRouter;

//req.body undefind 이거나 content 누락시 400 반환
function validateCommentIdParam(req, res, next) {
  const { commentId } = req.params;
  const parsedId = parseInt(commentId, 10);

  if (isNaN(parsedId) || parsedId <= 0) {
    return next(new Error("유효하지 않은 댓글 ID 형식입니다.", 400));
  }

  next();
}

//url id 올바른 형식인지 확인
function validateContentRequired(req, res, next) {
  const { content } = req.body || {};

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return next(new Error("댓글 내용을 입력해야 합니다.", 400));
  }

  next();
}
