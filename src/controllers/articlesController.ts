import {Request, Response} from 'express';
import { create } from 'superstruct';
import { IdParamsStruct } from '../structs/commonStructs';
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
  GetArticleListParamsStruct,
} from '../structs/articlesStructs';
import { articleService } from '../services/articleService';
import { GetCommentListParamsStruct, CreateCommentBodyStruct } from '../structs/commentsStruct';
import {commentService} from '../services/commentService';
import { AuthenticatedRequest } from '../types/express';

export async function createArticle(req: Request, res: Response) {
  const {user, body} = req as AuthenticatedRequest;
  const data = create(body, CreateArticleBodyStruct);

  const article = await articleService.createArticle(user.id, data);

  return res.status(201).send(article);
}

export async function getArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const article = await articleService.getArticle(id, req.user);

  return res.send(article);
}

export async function updateArticle(req: Request, res: Response) {
  const {user, body, params} = req as AuthenticatedRequest;
  const { id } = create(params, IdParamsStruct);
  const data = create(body, UpdateArticleBodyStruct);
  const updatedArticle = await articleService.updateArticle(user.id, id, data);
  return res.send(updatedArticle);
}

export async function deleteArticle(req: Request, res: Response) {
  const {user, params} = req as AuthenticatedRequest;
  const { id } = create(params, IdParamsStruct);
  await articleService.deleteArticle(user.id, id);
  return res.status(204).send();
}

export async function getArticleList(req: Request, res: Response) {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetArticleListParamsStruct);
  const result = await articleService.getList(page, pageSize, orderBy, keyword);
  return res.send(result);
}

export async function createComment(req: Request, res: Response) {
  const {user, body, params} = req as AuthenticatedRequest;
  const { id: articleId } = create(params, IdParamsStruct);
  const data = create(body, CreateCommentBodyStruct);
  const comment = await commentService.createComment(user.id, articleId, data, 'article');
  return res.status(201).send(comment);
}

export async function getCommentList(req: Request, res: Response) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);
  const result = await commentService.getComments(articleId, 'article',cursor, limit);
  return res.send(result);
}

export async function articleLike(req: Request, res: Response) {
  const {user, params} = req as AuthenticatedRequest;
  const { id: articleId } = create(params, IdParamsStruct);
  const result = await articleService.toggleLike(user.id, articleId);

  if (result.isLiked) {
    return res.status(201).send();
  } else {
    return res.status(204).send();
  }
}