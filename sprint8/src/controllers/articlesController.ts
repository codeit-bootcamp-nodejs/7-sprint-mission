import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient';
import NotFoundError from '../lib/errors/NotFoundError';
import { IdParamsStruct } from '../structs/commonStructs';
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
  GetArticleListParamsStruct,
} from '../structs/articlesStructs';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import BadRequestError from '../lib/errors/BadRequestError';
import { Request, Response } from 'express';
import * as articleService from '../services/articleService';

export async function createArticle(req : Request, res : Response) {
  const data = create(req.body, CreateArticleBodyStruct);
  const article = await articleService.createArticle({ ...data, userId: req.user!.id });
  return res.status(201).send(article);
}

export async function getArticle(req : Request, res : Response) {
  const { id } = create(req.params, IdParamsStruct);
  const article = await articleService.getArticle(id,req.user?.id);
  return res.send(article);
}

export async function updateArticle(req : Request, res : Response) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);
  const updatedArticle = await articleService.updateArticle(id, data, req.user);
  return res.send(updatedArticle);
}

export async function deleteArticle(req : Request, res : Response) {
  const { id } = create(req.params, IdParamsStruct);
  await articleService.deleteArticle(id, req.user);
  return res.status(204).send();
}

export async function getArticleList(req : Request, res : Response) {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetArticleListParamsStruct);
  
   const where = keyword
    ? {
        OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
      }
    : undefined;
  const totalCount = await articleService.countArticles(where);   
  const articleList = await articleService.getArticleList({
    page,
    pageSize,
    orderBy: orderBy ?? 'recent',
    keyword,
  }, req.user?.id);
  return res.send(articleList);       
}

export async function createComment(req : Request, res : Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id: articleId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);

  const createdComment = await articleService.createComment({
    articleId,
    content,
    userId: req.user.id,
  });

  return res.status(201).send(createdComment);
}

export async function getCommentList(req : Request, res : Response) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const { list, nextCursor } = await articleService.getCommentList({
    articleId,
    cursor: cursor ? Number(cursor) : undefined,
    limit,
  });   
  return res.send({
    list,
    nextCursor,
  });
}

export async function createLike(req : Request, res : Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }
  const { id: articleId } = create(req.params, IdParamsStruct);
  await articleService.createLike({
    articleId,
    userId: req.user.id,
  });
  return res.status(201).send();
}

export async function deleteLike(req : Request, res : Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id: articleId } = create(req.params, IdParamsStruct);
  
  await articleService.deleteLike(articleId, req.user.id);
  return res.status(204).send();
}
