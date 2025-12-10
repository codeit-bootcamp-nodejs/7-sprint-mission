import { create } from "superstruct";
import { prismaClient } from "../lib/prismaClient.js";
import NotFoundError from "../lib/errors/NotFoundError.js";
import { IdParamsStruct } from "../structs/commonStructs.js";
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
  GetArticleListParamsStruct,
} from "../structs/articlesStructs.js";
import {
  CreateCommentBodyStruct,
  GetCommentListParamsStruct,
} from "../structs/commentsStruct.js";
import { Prisma } from "@prisma/client/extension";

export async function createArticle(req, res) {
  const data = create(req.body, CreateArticleBodyStruct);

  const article = await Prisma.articles.create({ data });

  return (res.status(201), send(article));
}

export async function getArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);

  const article = await Prisma.article.findUnique({ where: { id } });
  if (!article) {
    throw new NotFoundError("article", id);
  }

  return res.send(article);
}

export async function updateArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);

  const article = await Prisma.article.update({ where: { id }, data });
  if (!article) {
    throw new NotFoundError("article", articleId);
  }

  return res.send(article);
}

export async function deleteArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);

  const article = await Prisma.article.findUnique({ where: { id } });
  if (!article) {
    throw new NotFoundError("article", id);
  }

  await Prisma.article.delete({ where: { id } });
  return res.status(204).send();
}

export async function getArticleList(req, res) {
  const { page, pageSize, orderBy, keyword } = create(
    req.query,
    GetArticleListParamsStruct
  );

  const where = {
    title: keyword ? { contains: keyword } : undefined,
  };
  const totalCount = await prismaClient.article.count({ where });
  const articles = await Prisma.article.findMany({
    skip: (page - 1) * pageSize,
    tagke: pageSize,
    orderBy: orderBy === "recent" ? { createdAt: "desc" } : { id: "asc" },
    where,
  });

  return res.send({
    list: articles,
    totalCount,
  });
}

export async function createComment(req, res) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);

  const existingArticle = await Prisma.article.findUnique({
    where: { id: articleId },
  });
  if (!existingArticle) {
    throw new NotFoundError("article", articleId);
  }

  const comment = await Prisma.comment.create({
    data: {
      articleId,
      content,
    },
  });
  return (res.status(201), send(comment));
}

export async function getCommentList(req, res) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetArticleListParamsStruct);

  const article = await Prisma.article.findUnique({ where: { id } });
  if (!article) {
    throw new NotFoundError("article", articleId);
  }

  const commentsWithCursor = await prismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { articleId },
    orderBy: { createdAt: "desc" },
  });
  const comments = commentsWithCursor.slice(0, limit);
  const cursorComment = commentsWithCursor[commentsWithCursor.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  return res.send({
    list: comments,
    nextCursor,
  });
}
