import { Router } from "express";
import {
  orderByToSort,
  createContinuationToken,
  parseContinuationToken,
  buildCursorWhere,
} from "../utils/cursor-pagination.js";
import { prisma } from "../prisma/prisma.js";
import { ArticleComment } from "./comment.js";

const articleCommentRouter = new Router({ mergeParams: true });

articleCommentRouter.post("/", validatePostComment, async (req, res) => {
  const { content } = req.body;

  const created = await prisma.article_comment.create({
    data: {
      content,
      article_id: req.params.articleId,
    },
  });
  const articleComment = ArticleComment.fromEntity(created);
  res.json(articleComment);
});

articleCommentRouter.patch(
  "/:commentId",
  validatePatchComment,
  async (req, res) => {
    const { content } = req.body;

    const updated = await prisma.article_comment.update({
      where: {
        id: req.params.commentId,
      },
      data: {
        content,
        article_id: req.params.articleId,
      },
    });
    const articleComment = ArticleComment.fromEntity(updated);
    res.json(articleComment);
  }
);
articleCommentRouter.delete("/:commentId", validateDeleteComment, (req, res) =>
  prisma.article_comment
    .delete({
      where: {
        id: req.params.commentId,
      },
    })
    .then(ArticleComment.fromEntity)
    .then((comment) => res.json(comment))
);

articleCommentRouter.get("/", validateGetComments, async (req, res) => {
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
    const nextCursor = hasNext
      ? createContinuationToken(
          {
            id: items[items.length - 1].id,
            created_at: items[items.length - 1].created_at,
          },
          sort
        )
      : null;

    const articleComments = items.map(ArticleComment.fromEntity);

    res.json({
      data: articleComments,
      nextCursor,
      hasNext,
    });
  } catch (e) {
    next(e);
  }
});
export default articleCommentRouter;

function validateDeleteComment(req, res, next) {
  next();
}
function validatePatchComment(req, res, next) {
  next();
}
function validateGetComments(req, res, next) {
  next();
}
function validatePostComment(req, res, next) {
  next();
}
