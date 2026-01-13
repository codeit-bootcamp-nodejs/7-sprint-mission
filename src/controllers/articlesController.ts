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

export async function createArticle(req: Request, res: Response) {
  const data = create(req.body, CreateArticleBodyStruct);

  const article = await articleService.createArticle(req.user!.id, data);

  return res.status(201).send(article);
}

export async function getArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const article = await articleService.getArticle(id, req.user);

  return res.send(article);
}

export async function updateArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);
  const updatedArticle = await articleService.updateArticle(id, req.user!.id, data);
  return res.send(updatedArticle);
}

export async function deleteArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  await articleService.deleteArticle(id, req.user!.id);
  return res.status(204).send();
}

export async function getArticleList(req: Request, res: Response) {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetArticleListParamsStruct);
  const result = await articleService.getList(page, pageSize, orderBy, keyword);
  return res.send(result);
}

export async function createComment(req: Request, res: Response) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const data = create(req.body, CreateCommentBodyStruct);
  const comment = await commentService.createComment(req.user!.id, articleId, data);
  return res.status(201).send(comment);
}

export async function getCommentList(req: Request, res: Response) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);
  const result = await commentService.getComments(articleId, cursor, limit);
  return res.send(result);
}

export async function articleLike(req: Request, res: Response) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const result = await articleService.toggleLike(req.user!.id, articleId);

  if (result.isLiked) {
    return res.status(201).send();
  } else {
    return res.status(204).send();
  }
}