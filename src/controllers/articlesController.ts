import { create } from 'superstruct';
import { Request, Response } from 'express';
import { prismaClient } from '../lib/prismaClient.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import { IdParamsStruct, IdParams } from '../structs/commonStructs.js';
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
  GetArticleListParamsStruct,
  CreateArticleBody,
  UpdateArticleBody,
  GetArticleListParams,
} from '../structs/articlesStructs.js';
import {
  CreateCommentBodyStruct,
  GetCommentListParamsStruct,
  CreateCommentBody,
  GetCommentListParams,
} from '../structs/commentsStruct.js';

import ForbiddenError from '../lib/errors/ForbiddenError.js';

export async function createArticle(req: Request, res: Response) {
  const data = create(req.body, CreateArticleBodyStruct) as CreateArticleBody;

  const article = await prismaClient.article.create({
    data: {
      ...data,
      userId: req.user!.id,
    },
  });

  return res.status(201).send(article);
}

export async function getArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct) as IdParams;
  const userId = req.user?.id; //로그인 여부 확인

  const article = await prismaClient.article.findUnique({ where: { id } });
  if (!article) {
    throw new NotFoundError('article', id);
  }
  let isLiked = false;
  if (userId) {
    const like = await prismaClient.like.findFirst({
      where: { userId: userId, articleId: id },
    });
    isLiked = !!like;
  }
  return res.status(200).json({ ...article, isLiked });
}

export async function updateArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct) as IdParams;
  const data = create(req.body, UpdateArticleBodyStruct) as UpdateArticleBody;

  const existingArticle = await prismaClient.article.findUnique({ where: { id } });

  if (!existingArticle) {
    throw new NotFoundError('article', id);
  }
  if (existingArticle.userId !== req.user!.id) {
    throw new ForbiddenError('게시글 수정 권한이 없습니다.');
  }
  const updatedArticle = await prismaClient.article.update({
    where: { id },
    data,
  });
  return res.status(200).json(updatedArticle);
}

export async function deleteArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct) as IdParams;

  const existingArticle = await prismaClient.article.findUnique({ where: { id } });
  if (!existingArticle) {
    throw new NotFoundError('article', id);
  }
  if (existingArticle.userId !== req.user!.id) {
    throw new ForbiddenError('게시글 삭제 권한이 없습니다.');
  }
  await prismaClient.article.delete({ where: { id } });

  return res.status(204).send();
}

export async function getArticleList(req: Request, res: Response) {
  const { page, pageSize, orderBy, keyword } = create(
    req.query,
    GetArticleListParamsStruct,
  ) as GetArticleListParams;
  const userId = req.user?.id;
  const where = {
    title: keyword ? { contains: keyword } : undefined,
  };

  const totalCount = await prismaClient.article.count({ where });
  const articles = await prismaClient.article.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
    where,
    include: {
      likes: userId
        ? {
            where: { userId },
          }
        : false,
    },
  });
  const listWithLiked = articles.map((article) => {
    const { likes = [], ...rest } = article;
    return {
      ...rest,
      isLiked: Array.isArray(likes) && likes.length > 0,
    };
  });
  return res.send({
    list: listWithLiked,
    totalCount,
  });
}

export async function createComment(req: Request, res: Response) {
  const { id: articleId } = create(req.params, IdParamsStruct) as IdParams;
  const { content } = create(req.body, CreateCommentBodyStruct) as CreateCommentBody;

  const existingArticle = await prismaClient.article.findUnique({ where: { id: articleId } });
  if (!existingArticle) {
    throw new NotFoundError('article', articleId);
  }

  const comment = await prismaClient.comment.create({
    data: {
      articleId,
      content,
      userId: req.user!.id,
    },
  });

  return res.status(201).send(comment);
}

export async function getCommentList(req: Request, res: Response) {
  const { id: articleId /*아이디 값 재정의*/ } = create(req.params, IdParamsStruct) as IdParams;
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct) as GetCommentListParams;

  const article = await prismaClient.article.findUnique({ where: { id: articleId } });
  if (!article) {
    throw new NotFoundError('article', articleId);
  }

  const commentsWithCursor = await prismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined, // 커서 값이 있으면은 {id:cursor} 실행 없으면은 undefind 실행
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

//게시글 좋아요, 좋아요취소
export async function likeArticle(req: Request, res: Response) {
  const articleId = Number(req.params.id);
  const userId = req.user!.id;

  const existingLike = await prismaClient.like.findFirst({
    where: { userId, articleId },
  });

  if (existingLike) {
    await prismaClient.like.delete({
      where: { id: existingLike.id },
    });
    return res.status(200).json({ isLiked: false });
  } else {
    await prismaClient.like.create({
      data: { userId, articleId },
    });
    return res.status(201).json({ isLiked: true });
  }
}
