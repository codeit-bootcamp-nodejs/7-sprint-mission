import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { sendSuccess, sendNoContent } from '../utils/response';

export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userService.getMe(req.user!.userId);
    sendSuccess(res, user);
  } catch (e) {
    next(e);
  }
}

export async function updateMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userService.updateMe(req.user!.userId, req.body);
    sendSuccess(res, user);
  } catch (e) {
    next(e);
  }
}

export async function changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await userService.changePassword(req.user!.userId, req.body.currentPassword, req.body.newPassword);
    sendNoContent(res);
  } catch (e) {
    next(e);
  }
}

export async function getMyProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const result = await userService.getMyProducts(req.user!.userId, page, pageSize);
    sendSuccess(res, result);
  } catch (e) {
    next(e);
  }
}

export async function getMyLikedProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const result = await userService.getMyLikedProducts(req.user!.userId, page, pageSize);
    sendSuccess(res, result);
  } catch (e) {
    next(e);
  }
}
