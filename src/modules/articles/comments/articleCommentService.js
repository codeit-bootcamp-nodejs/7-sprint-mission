import { prisma } from "../../../../prisma/prisma.js";
import { BadRequestError } from "../../../errors/customErrors.js";
import {
  buildCursorWhere,
  createContinuationToken,
  orderByToSort,
  parseContinuationToken,
} from "../../../utils/cursor-pagination.js";
import { ArticleComment } from "../entities/articleComment.js";

export const createdComment = async (content, articleId) => {
  const createdArticleComment = await prisma.articleComment.create({
    data: {
      content,
      article: {
        connect: { id: articleId },
      },
    },
  });

  return ArticleComment.fromEntity(createdArticleComment);
};

export const getComments = async ({ articleId, cursor, limit = "10" }) => {
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
    article_id: articleId,
  };

  const where =
    Object.keys(cursorWhere).length > 0
      ? { AND: [baseWhere, cursorWhere] }
      : baseWhere;

  const entities = await prisma.articleComment.findMany({
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

  const comments = items.map(ArticleComment.fromEntity);

  return { comments, nextCursor, hasNext };
};

export const updateComment = async (id, content) => {
  const updatedComment = await prisma.articleComment.update({
    where: { id },
    data: { content },
  });

  return ArticleComment.fromEntity(updatedComment);
};

export const deleteComment = async (id) => {
  const deletedComment = await prisma.articleComment.delete({ where: { id } });

  return ArticleComment.fromEntity(deletedComment);
};
