import { create } from 'superstruct';
import { prisma as prismaClient } from '../lib/prismaClient.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
  GetArticleListParamsStruct,
} from '../structs/articlesStructs.js';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';

export async function createArticle(req, res) {
  const data = create(req.body, CreateArticleBodyStruct);

  const article = await prismaClient.article.create({ data : { ...data, userId: req.user.id } });

  return res.status(201).send(article);
}

export async function getArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const userId = req.user.id;

  const article = await prismaClient.article.findUnique({ 
    where: { id }, 
    include: {_count: { select : { likes: true}}},
   })

  if (!article) {
    throw new NotFoundError('article', id);
  }

  let isLiked = false;
  if (userId) {
    const like = await prismaClient.articleLike.findUnique({ where: { userId, articleId: id } });
    isLiked = !!like;
  }

  return res.send({...article, isLiked});
}

export async function updateArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);

  const article = await prismaClient.article.update({ where: { id }, data });
  if (!article) {
    throw new NotFoundError('article', id);
  }

  if (article.userId !== req.user.id) {
    throw new ForbiddenError('You are not allowed to update this article');
  }
  
  const updatedArticle = await prismaClient.article.update({ where: { id }, data });

  return res.send(updatedArticle);
}

export async function deleteArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);

  const existingArticle = await prismaClient.article.findUnique({ where: { id } });
  if (!existingArticle) {
    throw new NotFoundError('article', id);
  }

  if (existingArticle.userId !== req.user.id) {
    throw new ForbiddenError('You are not allowed to delete this article');
  }

  await prismaClient.article.delete({ where: { id } });

  return res.status(204).send();
}

export async function getArticleList(req, res) {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetArticleListParamsStruct);

  const where = {
    title: keyword ? { contains: keyword } : undefined,
  };

  const totalCount = await prismaClient.article.count({ where });
  const articles = await prismaClient.article.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
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

  const existingArticle = await prismaClient.article.findUnique({ where: { id: articleId } });
  if (!existingArticle) {
    throw new NotFoundError('article', articleId);
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

  const article = await prismaClient.article.findUnique({ where: { id: articleId } });
  if (!article) {
    throw new NotFoundError('article', articleId);
  }

  const commentsWithCursor = await prismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { articleId },
    orderBy: { createdAt: 'desc' },
  });
  const comments = commentsWithCursor.slice(0, limit);
  const cursorComment = commentsWithCursor[commentsWithCursor.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  return res.send({
    list: comments,
    nextCursor,
  });
}

export async function articleLike(req, res) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const userId = req.user.id;

  const article = await prismaClient.article.findUnique({ where: { id: articleId } });
  if (!article) {
    throw new NotFoundError('article', articleId);
  }

  const existingLike = await prismaClient.articleLike.findUnique({ where: { userId_articleId: { articleId, userId } }});
  if (existingLike) {
    await prismaClient.articleLike.delete({ where: { id: existingLike.id } });
    return res.status(204).send();
  } else {
    await prismaClient.articleLike.create({ data: { articleId, userId } });
    return res.status(201).send();
  }
}