import { Request, Response, NextFunction } from 'express';
import { assert } from 'superstruct';
import { CreateArticleStruct, UpdateArticleStruct } from '../structs/articleStructs';
import * as articleService from '../services/articleService';
import * as commentService from '../services/commentService';
import { CreateCommentStruct } from '../structs/commentStructs';

export async function getArticles(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await articleService.getArticles({
      orderBy: String(req.query.orderBy ?? 'recent'),
      page: parseInt(String(req.query.page ?? '1')),
      pageSize: parseInt(String(req.query.pageSize ?? '10')),
      keyword: req.query.keyword ? String(req.query.keyword) : undefined,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const article = await articleService.getArticle(parseInt(req.params.id));
    res.json(article);
  } catch (err) {
    next(err);
  }
}

export async function createArticle(req: Request, res: Response, next: NextFunction) {
  try {
    assert(req.body, CreateArticleStruct);
    const article = await articleService.createArticle({
      ...req.body,
      userId: req.user!.id,
    });
    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
}

export async function updateArticle(req: Request, res: Response, next: NextFunction) {
  try {
    assert(req.body, UpdateArticleStruct);
    const article = await articleService.updateArticle(
      parseInt(req.params.id),
      req.user!.id,
      req.body
    );
    res.json(article);
  } catch (err) {
    next(err);
  }
}

export async function deleteArticle(req: Request, res: Response, next: NextFunction) {
  try {
    await articleService.deleteArticle(parseInt(req.params.id), req.user!.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function likeArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const article = await articleService.likeArticle(parseInt(req.params.id), req.user!.id);
    res.json(article);
  } catch (err) {
    next(err);
  }
}

export async function unlikeArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const article = await articleService.unlikeArticle(parseInt(req.params.id), req.user!.id);
    res.json(article);
  } catch (err) {
    next(err);
  }
}

export async function getArticleComments(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = parseInt(String(req.query.limit ?? '10'));
    const cursor = req.query.cursor ? parseInt(String(req.query.cursor)) : undefined;
    const result = await commentService.getArticleComments({
      articleId: parseInt(req.params.id),
      limit,
      cursor,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function createArticleComment(req: Request, res: Response, next: NextFunction) {
  try {
    assert(req.body, CreateCommentStruct);
    const comment = await commentService.createArticleComment({
      content: req.body.content,
      articleId: parseInt(req.params.id),
      userId: req.user!.id,
      commenterNickname: req.user!.nickname,
    });
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
}
