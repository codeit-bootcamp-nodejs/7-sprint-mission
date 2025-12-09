import { ProductComment } from "./comments.js";
import { Router } from "express";
import { prisma } from "../prisma/prisma.js";
import {
  createContinuationToken,
  parseContinuationToken,
  buildCursorWhere,
  orderByToSort,
} from "./cursor-pagination.js";
const productCommentRouter = new Router({ mergeParams: true });

const defaultOrderBy = [{ created_at: "desc" }, { id: "asc" }];
const defaultLimit = 10;

//상품 댓글 생성
productCommentRouter.post("/", async (req, res) => {
  const { content } = req.body;

  const created = await prisma.product_comment.create({
    data: {
      content,
      product_id: BigInt(req.params.productId),
    },
  });
  const productComment = ProductComment.fromEntity(created);
  res.json(productComment);
});
//상품 댓글 수정
productCommentRouter.patch("/:commentId", async (req, res) => {
  const { content } = req.body;

  const updated = await prisma.product_comment.update({
    where: {
      id: req.params.commentId,
    },
    data: {
      content,
      product_id: req.params.productId,
    },
  });
  const productComment = ProductComment.fromEntity(updated);
  res.json(productComment);
});
//상품 댓글 삭제
productCommentRouter.delete("/:commentId", (req, res) =>
  prisma.product_comment
    .delete({
      where: {
        id: req.params.commentId,
      },
    })
    .then(ProductComment.fromEntity)
    .then((comment) => res.json(comment))
);
//상품 댓글 목록조회
productCommentRouter.get("/", async (req, res) => {
  const requestedLimit = parseInt(req.query.limit, 10) || defaultLimit;
  const cursorToken = req.query.cursor;

  const parsedCursor = parseContinuationToken(cursorToken);
  const cursorData = parsedCursor ? parsedCursor.data : null;
  const sortDefinition = orderByToSort(defaultOrderBy);
  const cursorWhere = buildCursorWhere(cursorData, sortDefinition);

  const entities = await prisma.product_comment.findMany({
    where: {
      product_id: req.params.productId,
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
  const productComment = items.map(ProductComment.fromEntity);
  res.json({
    data: productComment,
    paging: {
      nextCursor: nextCursor,
      hasNextPage: hasNextPage,
      limit: requestedLimit,
    },
  });
});
export { productCommentRouter };
