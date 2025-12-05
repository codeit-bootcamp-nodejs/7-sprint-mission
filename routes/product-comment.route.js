import { Router } from "express";
import {
  orderByToSort,
  createContinuationToken,
  parseContinuationToken,
  buildCursorWhere,
} from "../utils/cursor-pagination.js";
import { prisma } from "../prisma/prisma.js";
import { ProductComment } from "./comment.js";
import {
  deleteComment,
  updateComment,
} from "../services/product_commentService.js";
import { BadRequestError } from "../utils/CustomErrors.js";

const productCommentRouter = new Router({ mergeParams: true });

// - 댓글 등록 API를 만들어 주세요.
// /products/:productId/comments/ POST
//     - `content`를 입력하여 댓글을 등록합니다.
//     - 중고마켓, 자유게시판 댓글 등록 API를 따로 만들어 주세요.
productCommentRouter.post("/", validateContentRequired, async (req, res) => {
  const { content } = req.body;

  const created = await prisma.product_comment.create({
    data: {
      content,
      product_id: req.params.productId,
    },
  });
  const productComment = ProductComment.fromEntity(created);
  res.json(productComment);
});

// - 댓글 목록 조회 API를 만들어 주세요.
// /products/:productId/comments/ GET
//     - `id`, `content`, `createdAt` 를 조회합니다.
//     - cursor 방식의 페이지네이션 기능을 포함해 주세요.

productCommentRouter.get("/", async (req, res, next) => {
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

    // 기본 where 조건 (product_id 필터)
    const baseWhere = {
      product_id: req.params.productId,
    };

    // cursor 조건과 기본 조건 병합
    const where =
      Object.keys(cursorWhere).length > 0
        ? { AND: [baseWhere, cursorWhere] }
        : baseWhere;

    // limit + 1개를 조회하여 다음 페이지 존재 여부 확인
    const entities = await prisma.product_comment.findMany({
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

    const productComments = items.map(ProductComment.fromEntity);

    res.json({
      data: productComments,
      lastElemCursor,
      hasNext,
    });
  } catch (e) {
    next(e);
  }
});

// - 댓글 수정 API를 만들어 주세요.
//     - `PATCH` 메서드를 사용해 주세요.
// /products/:productId/comments/:commentId PATCH
//     - `PATCH` 메서드를 사용해 주세요.
productCommentRouter.patch(
  "/:commentId",
  validateContentRequired,
  validateCommentIdParam,
  async (req, res, next) => {
    try {
      const { content } = req.body || {};
      const { commentId } = req.params;

      // 서비스에서 P2025 발생 시 여기서 catch됨
      const updatedEntity = await updateComment(commentId, { content });

      const productComment = ProductComment.fromEntity(updatedEntity);
      res.status(200).json(productComment);
    } catch (e) {
      next(e);
    }
  }
);

// - 댓글 삭제 API를 만들어 주세요.
// /products/:productId/comments/:commentId DELETE
productCommentRouter.delete(
  "/:commentId",
  validateCommentIdParam,
  async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const deletedEntity = await deleteComment(commentId);

      const productComment = ProductComment.fromEntity(deletedEntity);
      if (!productComment) {
        throw new NotFoundError("comment", commentId);
      }
      res.status(200).json(productComment);
    } catch (e) {
      next(e); // 에러 핸들러로 전달
    }
  }
);

export default productCommentRouter;

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
