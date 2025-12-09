import { ArticleComment } from "./comments.js";
import { Router } from "express";
import { prisma } from "../prisma/prisma.js";
const articleCommentRouter = new Router({ mergeParams: true });

//게시글 댓글 생성
articleCommentRouter.post("/", async (req, res) => {
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
//게시글 댓글 수정
articleCommentRouter.patch("/:commentId", async (req, res) => {
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
});
//게시글 댓글 삭제
articleCommentRouter.delete("/:commentId", (req, res) =>
  prisma.article_comment
    .delete({
      where: {
        id: req.params.commentId,
      },
    })
    .then(ArticleComment.fromEntity)
    .then((comment) => res.json(comment))
);
//게시글 댓글 목록조회
articleCommentRouter.get("/", async (req, res) => {
  const requestedLimit = parseInt(req.query.limit, 10) || defaultLimit;
  const cursorToken = req.query.cursor;

  const parsedCursor = parseContinuationToken(cursorToken);
  const cursorData = parsedCursor ? parsedCursor.data : null;
  const sortDefinition = orderByToSort(defaultOrderBy);
  const cursorWhere = buildCursorWhere(cursorData, sortDefinition);

  const entities = await prisma.article_comment.findMany({
    where: {
      article_id: req.params.articleId,
      ...cursorWhere,
    },
    orderBy: defaultOrderBy,
    take: requestedLimit + 1,
  });
  const fetchedCount = entities.length;
  const hasNextPage = fetchedCount > requestedLimit;
  const items = hasNextPage ? entities.slice(0, requestedLimit) : entities;

  const lastFetchedItem = items[items.length - 1];
  const nextCursor = hasNextPage
    ? createContinuationToken(lastFetchedItem, sortDefinition)
    : null;
  const articleComment = items.map(ArticleComment.fromEntity);
  res.json({
    data: articleComment,
    paging: {
      nextCursor: nextCursor,
      hasNextPage: hasNextPage,
      limit: requestedLimit,
    },
  });
});
export { articleCommentRouter };
