import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
  GetArticleListParamsStruct,
} from '../structs/articlesStructs.js';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct.js';

// ## 게시글 기능 인가
// ### 로그인한 유저만 게시글을 등록할 수 있습니다.
// ### 게시글을 등록한 유저만 해당 게시글을 수정하거나 삭제할 수 있습니다.

export async function createArticle(req, res) {
  const data = create(req.body, CreateArticleBodyStruct);
  // req.user.id를 추가하여 DB에 저장
  const article = await prismaClient.article.create({ data: { ...data, userId: req.user.id } });

  return res.status(201).send(article);
}

export async function getArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const currentUserId = req.user?.id;

  const article = await prismaClient.article.findUnique({
    where: { id },
    include: {
      // 로그인한 유저가 있다면, 해당 유저의 좋아요 기록만 골라서 가져옴
      ArticleLikes: currentUserId ? { where: { userId: currentUserId } } : false,
    },
  });
  if (!article) {
    throw new NotFoundError('article', id);
  }

  // ArticleLikes 배열에 값이 있으면 true, 없으면 false
  const response = {
    ...article,
    isLiked: !!(article.ArticleLikes && article.ArticleLikes.length > 0),
  };

  // 클라이언트에게 보내기 전, 불필요한 ArticleLikes 배열 데이터는 삭제
  delete response.ArticleLikes;
  return res.send(response);
}

export async function updateArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);

  // 게시글 있는지 확인
  // 1. 먼저 해당 게시글을 가져옴
  const existingArticle = await prismaClient.article.findUnique({ where: { id } });
  if (!existingArticle) {
    throw new NotFoundError('article', id);
  }
  // 2. [인가 로직] 게시글의 userId와 로그인한 유저의 id 비교
  if (existingArticle.userId !== req.user.id) {
    return res.status(403).json({ message: '본인의 게시글만 수정할 수 있습니다' });
  }

  const article = await prismaClient.article.update({ where: { id }, data });
  return res.send(article);
}

export async function deleteArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);

  const existingArticle = await prismaClient.article.findUnique({ where: { id } });
  if (!existingArticle) {
    throw new NotFoundError('article', id);
  }
  if (existingArticle.userId !== req.user.id) {
    return res.status(403).json({ message: '본인의 게시글만 삭제할 수 있습니다' });
  }

  await prismaClient.article.delete({ where: { id } });
  return res.status(204).send('게시글 삭제 완료');
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
export async function toggleArticleLike(req, res) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const userId = req.user.id;

  const existingLike = await prismaClient.articleLike.findUnique({
    where: { userId_articleId: { userId, articleId } },
  });

  if (existingLike) {
    await prismaClient.articleLike.delete({ where: { id: existingLike.id } });
    return res.send({ isLiked: false });
  }

  await prismaClient.articleLike.create({ data: { userId, articleId } });
  return res.status(201).send({ isLiked: true });
}
