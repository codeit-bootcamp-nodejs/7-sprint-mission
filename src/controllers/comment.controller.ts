import { Request, Response, NextFunction } from 'express';
import * as commentService from '../services/comment.service';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response';

export async function createProductComment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const productId = parseInt(req.params.id);
    const result = await commentService.createProductComment({
      content: req.body.content,
      productId,
      authorId: req.user!.userId,
    });
    sendCreated(res, result);
  } catch (e) {
    next(e);
  }
}

export async function createArticleComment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const articleId = parseInt(req.params.id);
    const result = await commentService.createArticleComment({
      content: req.body.content,
      articleId,
      authorId: req.user!.userId,
    });
    sendCreated(res, result);
  } catch (e) {
    next(e);
  }
}

export async function getProductComments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const productId = parseInt(req.params.id);
    const cursor = req.query.cursor ? parseInt(req.query.cursor as string) : undefined;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await commentService.getProductComments(productId, cursor, limit);
    sendSuccess(res, result);
  } catch (e) {
    next(e);
  }
}

export async function getArticleComments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const articleId = parseInt(req.params.id);
    const cursor = req.query.cursor ? parseInt(req.query.cursor as string) : undefined;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await commentService.getArticleComments(articleId, cursor, limit);
    sendSuccess(res, result);
  } catch (e) {
    next(e);
  }
}

export async function updateComment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const type = req.query.type;
    if (type !== 'product' && type !== 'article') {
      res.status(400).json({ success: false, message: 'query param "type" must be "product" or "article"' });
      return;
    }
    const result = await commentService.updateComment(type, id, req.body.content, req.user!.userId);
    sendSuccess(res, result);
  } catch (e) {
    next(e);
  }
}

export async function deleteComment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const type = req.query.type;
    if (type !== 'product' && type !== 'article') {
      res.status(400).json({ success: false, message: 'query param "type" must be "product" or "article"' });
      return;
    }
    await commentService.deleteComment(type, id, req.user!.userId);
    sendNoContent(res);
  } catch (e) {
    next(e);
  }
}
