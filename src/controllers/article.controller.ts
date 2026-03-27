import { Request, Response, NextFunction } from 'express';
import * as articleService from '../services/article.service';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response';

export async function getArticles(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const keyword = req.query.keyword as string | undefined;
    const userId = req.user?.userId;
    const result = await articleService.getArticles({ page, pageSize, keyword, userId });
    sendSuccess(res, result);
  } catch (e) {
    next(e);
  }
}

export async function getArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user?.userId;
    const result = await articleService.getArticle(id, userId);
    sendSuccess(res, result);
  } catch (e) {
    next(e);
  }
}

export async function createArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await articleService.createArticle(req.body, req.user!.userId);
    sendCreated(res, result);
  } catch (e) {
    next(e);
  }
}

export async function updateArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const result = await articleService.updateArticle(id, req.body, req.user!.userId);
    sendSuccess(res, result);
  } catch (e) {
    next(e);
  }
}

export async function deleteArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    await articleService.deleteArticle(id, req.user!.userId);
    sendNoContent(res);
  } catch (e) {
    next(e);
  }
}

export async function likeArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const result = await articleService.likeArticle(id, req.user!.userId);
    sendSuccess(res, result);
  } catch (e) {
    next(e);
  }
}

export async function unlikeArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const result = await articleService.unlikeArticle(id, req.user!.userId);
    sendSuccess(res, result);
  } catch (e) {
    next(e);
  }
}
