import { Request, Response } from "express";
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
} from "../structs/commentsStructs.js";

export async function createArticle(req: Request, res: Response) {
  const data = create(req.body, CreateArticleBodyStruct);

  const article = await prismaClient.article.create({
    data: {
      ...data,
      userId: Number((req as any).user.id),
    },
  });

  return res.status(201).send(article);
}

export async function getArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);

  const article = await prismaClient.article.findUnique({
    where: { id: Number(id) },
  });
  if (!article) {
    throw new NotFoundError("article", id.toString());
  }

  return res.send(article);
}

export async function updateArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);

  const article = await prismaClient.article.findUnique({
    where: { id: Number(id) },
  });
  if (!article) {
    throw new NotFoundError("article", id.toString());
  }
  if (article.userId !== (req as any).user.id) {
    return res.status(403).json({ message: "자기 게시글만 수정가능" });
  }
  const updated = await prismaClient.article.update({ where: { id }, data });
  return res.send(updated);
}

export async function deleteArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);

  const existingArticle = await prismaClient.article.findUnique({
    where: { id: Number(id) },
  });
  if (!existingArticle) {
    throw new NotFoundError("article", id.toString());
  }
  if (existingArticle.userId !== (req as any).user.id) {
    return res.status(403).json({ message: "자기 게시글만 삭제가능" });
  }
  await prismaClient.article.delete({ where: { id } });

  return res.status(204).send();
}

export async function getArticleList(req: Request, res: Response) {
  const { page, pageSize, orderBy, keyword } = create(
    req.query,
    GetArticleListParamsStruct
  );

  const where = {
    title: keyword ? { contains: keyword } : undefined,
  };

  const totalCount = await prismaClient.article.count({ where });
  const articles = await prismaClient.article.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === "recent" ? { createdAt: "desc" } : { id: "asc" },
    where,
  });

  return res.send({
    list: articles,
    totalCount,
  });
}

export async function createComment(req: Request, res: Response) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);

  const existingArticle = await prismaClient.article.findUnique({
    where: { id: Number(articleId) },
  });
  if (!existingArticle) {
    throw new NotFoundError("article", String(articleId));
  }

  const comment = await prismaClient.comment.create({
    data: {
      id: Number(articleId),
      userId: Number((req as any).user.id),
      content,
    },
  });

  return res.status(201).send(comment);
}

export async function getCommentList(req: Request, res: Response) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const article = await prismaClient.article.findUnique({
    where: { id: Number(articleId) },
  });
  if (!article) {
    throw new NotFoundError("article", String(articleId));
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
