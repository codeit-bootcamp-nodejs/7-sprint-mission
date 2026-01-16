import { Request, Response } from 'express';
import { prismaClient } from '../lib/prismaClient.js';
import { ArticleRepository } from '../repositories/articleRepository.js';
import { LikeRepository } from '../repositories/likeRepository.js';
import { CommentRepository } from '../repositories/commentRepository.js';
import { ProductRepository } from '../repositories/productRepository.js';
import { ArticleService } from '../services/articleService.js';
import { CommentService } from '../services/commentService.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
import {
  idParamsSchema,
  pageParamsSchema,
  cursorParamsSchema,
} from '../schemas/commonSchemas.js';
import {
  createArticleSchema,
  updateArticleSchema,
} from '../schemas/articleSchemas.js';
import { createCommentSchema } from '../schemas/commentSchemas.js';

// Initialize repositories and services
const articleRepository = new ArticleRepository(prismaClient);
const likeRepository = new LikeRepository(prismaClient);
const commentRepository = new CommentRepository(prismaClient);
const productRepository = new ProductRepository(prismaClient);

const articleService = new ArticleService(articleRepository, likeRepository);
const commentService = new CommentService(commentRepository, productRepository, articleRepository);

export async function createArticle(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const data = createArticleSchema.parse(req.body);
  const article = await articleService.createArticle(req.user.id, data);

  return res.status(201).send(article);
}

export async function getArticle(req: Request, res: Response) {
  const { id } = idParamsSchema.parse(req.params);
  const article = await articleService.getArticle(id, req.user?.id);

  return res.send(article);
}

export async function updateArticle(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id } = idParamsSchema.parse(req.params);
  const data = updateArticleSchema.parse(req.body);

  const updatedArticle = await articleService.updateArticle(id, req.user.id, data);
  
  return res.send(updatedArticle);
}

export async function deleteArticle(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id } = idParamsSchema.parse(req.params);
  await articleService.deleteArticle(id, req.user.id);

  return res.status(204).send();
}

export async function getArticleList(req: Request, res: Response) {
  const { page, pageSize, orderBy, keyword } = pageParamsSchema.parse(req.query);

  const result = await articleService.getArticleList(
    page,
    pageSize,
    orderBy || 'recent',
    keyword,
    req.user?.id
  );

  return res.send(result);
}

export async function createComment(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id: articleId } = idParamsSchema.parse(req.params);
  const data = createCommentSchema.parse(req.body);

  const createdComment = await commentService.createArticleComment(
    articleId,
    req.user.id,
    data
  );

  return res.status(201).send(createdComment);
}

export async function getCommentList(req: Request, res: Response) {
  const { id: articleId } = idParamsSchema.parse(req.params);
  const { cursor, limit } = cursorParamsSchema.parse(req.query);

  const result = await commentService.getArticleComments(articleId, cursor, limit);

  return res.send(result);
}

export async function createLike(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id: articleId } = idParamsSchema.parse(req.params);
  await articleService.createLike(articleId, req.user.id);

  return res.status(201).send();
}

export async function deleteLike(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id: articleId } = idParamsSchema.parse(req.params);
  await articleService.deleteLike(articleId, req.user.id);

  return res.status(204).send();
}
