import { Request, Response, NextFunction } from 'express';
import * as productService from '../services/product.service';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response';

export async function getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const keyword = req.query.keyword as string | undefined;
    const userId = req.user?.userId;
    const result = await productService.getProducts({ page, pageSize, keyword, userId });
    sendSuccess(res, result);
  } catch (e) {
    next(e);
  }
}

export async function getProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user?.userId;
    const result = await productService.getProduct(id, userId);
    sendSuccess(res, result);
  } catch (e) {
    next(e);
  }
}

export async function createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await productService.createProduct(req.body, req.user!.userId);
    sendCreated(res, result);
  } catch (e) {
    next(e);
  }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const result = await productService.updateProduct(id, req.body, req.user!.userId);
    sendSuccess(res, result);
  } catch (e) {
    next(e);
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    await productService.deleteProduct(id, req.user!.userId);
    sendNoContent(res);
  } catch (e) {
    next(e);
  }
}

export async function likeProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const result = await productService.likeProduct(id, req.user!.userId);
    sendSuccess(res, result);
  } catch (e) {
    next(e);
  }
}

export async function unlikeProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const result = await productService.unlikeProduct(id, req.user!.userId);
    sendSuccess(res, result);
  } catch (e) {
    next(e);
  }
}
