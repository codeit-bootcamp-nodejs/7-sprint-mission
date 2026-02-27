import { create } from 'superstruct';
import {
  UpdateMeBodyStruct,
  UpdatePasswordBodyStruct,
  GetMyProductListParamsStruct,
  GetMyFavoriteListParamsStruct,
  GetMyNotificationListParamsStruct,
} from '../structs/usersStructs';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import { Request, Response } from 'express';
import * as userService from '../services/userService';
import * as notificationService from '../services/notificationService';
import { IdParamsStruct } from '../structs/commonStructs';

export async function getMe(req : Request, res : Response) {
  const user = await userService.getMe(req.user!.id);
  return res.send(user);
}

export async function updateMe(req : Request, res : Response) {
  const data = create(req.body, UpdateMeBodyStruct);
  const updatedUser = await userService.updateMe(req.user!.id, data);
  return res.status(200).send(updatedUser);
}

export async function updateMyPassword(req : Request, res : Response) {

  const { password, newPassword } = create(req.body, UpdatePasswordBodyStruct);
  await userService.updateMyPassword(req.user!.id, password, newPassword);
  return res.status(200).send();

}

export async function getMyProductList(req : Request, res : Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { page, pageSize, orderBy, keyword } = create(req.query, GetMyProductListParamsStruct);

  const where = keyword
    ? {
        OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
      }
    : {};

  const totalCount = await userService.countMyProducts(req.user.id, where);
  const products = await userService.getMyProductList(req.user.id, {
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy : orderBy === 'recent' ? 'recent' : 'oldest',
    where,
    userId: req.user.id,
  });
  return res.send({
    list: products,
    totalCount,
  });
}  

export async function getMyFavoriteList(req : Request, res : Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { page, pageSize, orderBy, keyword } = create(req.query, GetMyFavoriteListParamsStruct);

  const where = keyword
    ? {
        OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
      }
    : {};
    
  const totalCount = await userService.countMyFavorites(req.user.id, where);
  const products  = await userService.getMyFavoriteList(req.user.id, {
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy : orderBy === 'recent' ? 'recent' : 'oldest',
    
  });
  return res.send({
    list: products,
    totalCount,
  });
}

export async function getMyNotifications(req : Request, res : Response) {
  const { cursor, limit } = create(req.query, GetMyNotificationListParamsStruct);
  const {list, totalCount, unreadCount, nextCursor} = await notificationService.getNotifications(req.user!.id, { cursor, limit });  
  return res.send({
    list,
    totalCount,
    unreadCount,
    nextCursor,
  });
}

export async function markNotificationAsRead(req : Request, res : Response) {
  const { id } = create(req.params, IdParamsStruct);
  await notificationService.markNotificationAsRead(id);
  return res.status(200).send();
}   