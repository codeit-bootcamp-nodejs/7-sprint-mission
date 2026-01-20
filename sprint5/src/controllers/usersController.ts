import { create } from 'superstruct';
import { userService } from '../services/usersService.js';
import {
  UpdateMeBodyStruct,
  UpdatePasswordBodyStruct,
  GetMyProductListParamsStruct,
  GetMyFavoriteListParamsStruct,
} from '../structs/usersStructs.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
import type { Request, Response } from 'express';

export async function getMe(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('Unauthorized');
  const user = await userService.getUserInfo(req.user.id);
  return res.send(user);
}

export async function updateMe(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('Unauthorized');
  const data = create(req.body, UpdateMeBodyStruct);
  const updated = await userService.updateUserInfo(req.user.id, data);
  return res.status(200).send(updated);
}

export async function updateMyPassword(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('Unauthorized');
  const data = create(req.body, UpdatePasswordBodyStruct);
  await userService.updatePassword(req.user.id, data);
  return res.status(200).send();
}

export async function getMyProductList(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('Unauthorized');
  const query = create(req.query, GetMyProductListParamsStruct);
  const result = await userService.getMyProducts(req.user.id, query);
  return res.send(result);
}

export async function getMyFavoriteList(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('Unauthorized');
  const query = create(req.query, GetMyFavoriteListParamsStruct);
  const result = await userService.getMyFavorites(req.user.id, query);
  return res.send(result);
}
