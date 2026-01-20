import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import { CreateArticleBodyStruct, UpdateArticleBodyStruct, GetArticleListParamsStruct } from '../structs/articlesStructs.js';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct.js';

export const createArticle = async (req, res) => {
  const data = create(req.body, CreateArticleBodyStruct);
  const article = await prismaClient.article.create({
    data: { ...data, user: { connect: { id: req.user.id } } },
  });
  res.status(201).json(article);
};

export const getArticle = async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const article = await prismaClient.article.findUnique({
    where: { id },
    include: { _count: { select: { likes: true } } },
  });
  if (!article) throw new NotFoundError('article', id);

 let isLiked = false;
  if (req.user) {
    const like = await prismaClient.like.findUnique({
      where: {
        userId_articleId: { 
          userId: req.user.id, 
          articleId: id 
        },
      },
    });
    isLiked = !!like;
  }

  res.json({ 
    ...article, 
    likeCount: article._count.likes, 
    isLiked 
  });
};

export const updateArticle = async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);
  const article = await prismaClient.article.findUnique({ where: { id } });
  if (!article) throw new NotFoundError('article', id);
  if (article.userId !== req.user.id) return res.status(403).json({ message: '권한이 없습니다.' });

  const updated = await prismaClient.article.update({ where: { id }, data });
  res.json(updated);
};

export const deleteArticle = async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const article = await prismaClient.article.findUnique({ where: { id } });
  if (!article) throw new NotFoundError('article', id);
  if (article.userId !== req.user.id) return res.status(403).json({ message: '권한이 없습니다.' });

  await prismaClient.article.delete({ where: { id } });
  res.status(204).send();
};

export const getArticleList = async (req, res) => {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetArticleListParamsStruct);
  const where = keyword ? { title: { contains: keyword } } : {};
  const [totalCount, list] = await Promise.all([
    prismaClient.article.count({ where }),
    prismaClient.article.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
      where,
    }),
  ]);
  res.json({ list, totalCount });
};

export const toggleArticleLike = async (req, res) => {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const where = { userId_articleId: { userId: req.user.id, articleId } };
  const existing = await prismaClient.like.findUnique({ where });

  if (existing) {
    await prismaClient.like.delete({ where });
    res.json({ isLiked: false });
  } else {
    await prismaClient.like.create({
      data: { user: { connect: { id: req.user.id } }, article: { connect: { id: articleId } } },
    });
    res.json({ isLiked: true });
  }
};

export const createComment = async (req, res) => {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);

  const article = await prismaClient.article.findUnique({ where: { id: articleId } });
  if (!article) throw new NotFoundError('article', articleId);

  const comment = await prismaClient.comment.create({
    data: {
      content,
      article: { connect: { id: articleId } },
      user: { connect: { id: req.user.id } },
    },
  });
  res.status(201).json(comment);
};

export const getCommentList = async (req, res) => {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const article = await prismaClient.article.findUnique({ where: { id: articleId } });
  if (!article) throw new NotFoundError('article', articleId);

  const commentsWithCursor = await prismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { articleId },
    orderBy: { createdAt: 'desc' },
  });

  const list = commentsWithCursor.slice(0, limit);
  const nextCursor = commentsWithCursor.length > limit ? commentsWithCursor[limit].id : null;

  res.json({ list, nextCursor });
};