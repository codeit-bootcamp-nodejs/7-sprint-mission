import { Request, Response, NextFunction } from 'express';
import { assert } from 'superstruct';
import { UpdateUserStruct, UpdatePasswordStruct } from '../structs/userStructs';
import * as userService from '../services/userService';
import * as notificationService from '../services/notificationService';

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.getMe(req.user!.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateMe(req: Request, res: Response, next: NextFunction) {
  try {
    assert(req.body, UpdateUserStruct);
    const user = await userService.updateMe(req.user!.id, req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function updatePassword(req: Request, res: Response, next: NextFunction) {
  try {
    assert(req.body, UpdatePasswordStruct);
    const user = await userService.updatePassword(
      req.user!.id,
      req.body.password,
      req.body.newPassword
    );
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function getMyProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(String(req.query.page ?? '1'));
    const pageSize = parseInt(String(req.query.pageSize ?? '10'));
    const result = await userService.getMyProducts({
      userId: req.user!.id,
      page,
      pageSize,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getMyFavorites(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(String(req.query.page ?? '1'));
    const pageSize = parseInt(String(req.query.pageSize ?? '10'));
    const result = await userService.getMyFavorites({
      userId: req.user!.id,
      page,
      pageSize,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getMyNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = parseInt(String(req.query.limit ?? '10'));
    const cursor = req.query.cursor ? parseInt(String(req.query.cursor)) : undefined;
    const result = await notificationService.getNotifications({
      userId: req.user!.id,
      limit,
      cursor,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getMyUnreadCount(req: Request, res: Response, next: NextFunction) {
  try {
    const count = await notificationService.getUnreadCount(req.user!.id);
    res.json({ count });
  } catch (err) {
    next(err);
  }
}
