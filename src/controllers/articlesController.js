import { create } from "superstruct";
import { prismaClient } from "../lib/prismaClient.js";
import NotFoundError from "../lib/errors/NotFoundError.js";
import BadRequestError from "../lib/errors/BadRequestError.js";

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

export async function createArticle(req, res) {
  const { title, content, image } = create(req.body, CreateArticleBodyStruct);
  const article = await prismaClient.article.create({
    data: { title, content, image, userId: req.user.id },
  });
  return res.status(201).send(article);
}

export async function getArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);

  const article = await prismaClient.article.findUnique({ where: { id } });
  if (!article) {
    throw new NotFoundError("article", id);
  }
  const isLiked = await prismaClient.like.findFirst({
    where: { userId: article.userId, articleId: id },
  });

  return res.send({ article: article, isLike: boolean(isLiked) });
}

export async function updateArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);

  const { title, content, image } = create(req.body, UpdateArticleBodyStruct);
  const existingArticle = await prismaClient.article.findUnique({
    where: { id },
  });
  if (!existingArticle) {
    throw new NotFoundError("article", id);
  }
  if (existingArticle.userId !== req.user.id) {
    throw new BadRequestError("게시글 등록한 유저정보가 맞지 않습니다.");
  }

  const updatedAtticle = await prismaClient.article.update({
    where: { id },
    data: { title, content, image },
  });

  return res.send(updatedAtticle);
}

export async function deleteArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);

  const existingArticle = await prismaClient.article.findUnique({
    where: { id },
  });
  if (!existingArticle) {
    throw new NotFoundError("article", id);
  }
  if (existingArticle.userId !== req.user.id) {
    throw new BadRequestError("게시글 등록한 유저정보가 맞지 않습니다.");
  }

  await prismaClient.article.delete({ where: { id } });

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

export async function createComment(req, res) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);

  const existingArticle = await prismaClient.article.findUnique({
    where: { id: articleId },
  });
  if (!existingArticle) {
    throw new NotFoundError("article", articleId);
  }

  const comment = await prismaClient.comment.create({
    data: {
      articleId,
      content,
      userId: req.user.id,
    },
  });

  return res.status(201).send(comment);
}

export async function getCommentList(req, res) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const article = await prismaClient.article.findUnique({
    where: { id: articleId },
  });
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

export async function likeArticle(req, res) {
  try {
    const { id } = create(req.params, IdParamsStruct);
    const userId = req.user.id;
    const like = await prismaClient.like.create({
      data: { userId, productId: id },
    });
    res.status(200).send(like);
  } catch (error) {
    return res.status(400).send({ message: "Already like" });
  }
}
export async function dislikeArticle(req, res) {
  try {
    const { id } = create(req.params, IdParamsStruct);
    const userId = req.user.id;

    const existingLikeArticle = await prismaClient.like.findFirst({
      where: { productId: id, userId: userId },
    });

    if (!existingLikeArticle) {
      throw new NotFoundError("no liked Artivle", existingLikeArticle.id);
    }
    const dislike = await prismaClient.like.delete({
      where: { id: existinglikelike.id },
    });
    res.status(200).send(dislike);
  } catch (error) {
    return res.status(400).send({ message: "Already Dislike" });
  }
}
