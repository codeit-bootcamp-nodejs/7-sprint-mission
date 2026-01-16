import { create } from 'superstruct';
import { articleService } from '../services/articlesService.js';
import { articleRepository } from '../repositories/articlesRepository.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
  GetArticleListParamsStruct,
} from '../structs/articlesStructs.js';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
import type { Request, Response } from 'express';

// 게시글 생성
export async function createArticle(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('Unauthorized');
  const data = create(req.body, CreateArticleBodyStruct);
  const article = await articleRepository.create({ ...data, userId: req.user.id });
  return res.status(201).send(article);
}

// 게시물 목록 조회
export async function getArticleList(req: Request, res: Response) {
  const query = create(req.query, GetArticleListParamsStruct);
  const result = await articleService.getArticleList(query, req.user?.id);
  return res.send(result);
}

// 게시물 상세 조회
export async function getArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const article = await articleService.getArticle(id, req.user?.id);
  return res.send(article);
}

// 게시물 수정
export async function updateArticle(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('Unauthorized');
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);
  const updated = await articleService.updateArticle(id, req.user.id, data);
  return res.send(updated);
}

// 게시물 삭제
export async function deleteArticle(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('Unauthorized');
  const { id } = create(req.params, IdParamsStruct);
  await articleService.deleteArticle(id, req.user.id);
  return res.status(204).send();
}

// 댓글 생성
export async function createComment(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('Unauthorized');
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct) as { content: string };
  const comment = await articleService.createComment(articleId, req.user.id, content);
  return res.status(201).send(comment);
}

// 댓글 목록 조회
export async function getCommentList(req: Request, res: Response) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const query = create(req.query, GetCommentListParamsStruct);
  const result = await articleService.getCommentList(articleId, query);
  return res.send(result);
}

// 좋아요 생성
export async function createLike(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('Unauthorized');
  const { id: articleId } = create(req.params, IdParamsStruct);
  await articleService.toggleLike(articleId, req.user.id, true);
  return res.status(201).send();
}

// 좋아요 삭제
export async function deleteLike(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('Unauthorized');
  const { id: articleId } = create(req.params, IdParamsStruct);
  await articleService.toggleLike(articleId, req.user.id, false);
  return res.status(204).send();
}
