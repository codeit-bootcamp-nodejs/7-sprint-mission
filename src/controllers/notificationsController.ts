import { Request, Response } from 'express';
import { create } from 'superstruct';
import { IdParamsStruct, PageParamsStruct } from '../structs/commonStructs';
import { notificationService } from '../services/notificationService';
import { AuthenticatedRequest } from '../types/express';

export async function getNotifications(req: Request, res: Response) {
  const { page, pageSize } = create(req.query, PageParamsStruct);
  const authReq = req as AuthenticatedRequest;

  const notifications = await notificationService.getList(authReq.user.id, page, pageSize);
  res.send(notifications);
}

export async function getUnreadCount(req: Request, res: Response) {
  const authReq = req as AuthenticatedRequest;
  const count = await notificationService.getUnreadCount(authReq.user.id);
  res.send({ count });
}

export async function markAsRead(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const authReq = req as AuthenticatedRequest;

  const updatedNotification = await notificationService.markAsRead(authReq.user.id, id);
  res.send(updatedNotification);
}