import { prisma } from "../../../../prisma/prisma.js";
import { BadRequestError } from "../../../errors/coustomErrors.js";
import {
  buildCursorWhere,
  createContinuationToken,
  orderByToSort,
  parseContinuationToken,
} from "../../../utils/cursor-pagination.js";
import { ProductComment } from "../entities/productComment.js";

export const createdComment = async (content, productId) => {
  const createdProductComment = await prisma.productComment.create({
    data: {
      content,
      product: {
        connect: { id: productId },
      },
    },
  });

  return ProductComment.fromEntity(createdProductComment);
};

export const getComments = async ({ productId, cursor, limit = "10" }) => {
  const take = parseInt(limit);

  if (isNaN(take) || take <= 0) {
    throw new BadRequestError("유효하지 않은 limit 값입니다.");
  }

  const orderBy = [{ created_at: "desc" }, { id: "asc" }];
  const sort = orderByToSort(orderBy);

  const cursorToken = parseContinuationToken(cursor);
  const cursorWhere = cursorToken
    ? buildCursorWhere(cursorToken.data, cursorToken.sort)
    : {};

  const baseWhere = {
    product_id: productId,
  };

  const where =
    Object.keys(cursorWhere).length > 0
      ? { AND: [baseWhere, cursorWhere] }
      : baseWhere;

  const entities = await prisma.productComment.findMany({
    where,
    orderBy,
    take: take + 1,
  });

  const hasNext = entities.length > take;
  const items = hasNext ? entities.slice(0, take) : entities;

  const nextCursor = hasNext
    ? createContinuationToken(
        {
          id: items[items.length - 1].id,
          created_at: items[items.length - 1].created_at,
        },
        sort
      )
    : null;

  const comments = items.map(ProductComment.fromEntity);

  return { comments, nextCursor, hasNext };
};

export const updateComment = async (id, content) => {
  const updatedComment = await prisma.productComment.update({
    where: { id },
    data: { content },
  });

  return ProductComment.fromEntity(updatedComment);
};

export const deleteComment = async (id) => {
  const deletedComment = await prisma.productComment.delete({ where: { id } });

  return ProductComment.fromEntity(deletedComment);
};
