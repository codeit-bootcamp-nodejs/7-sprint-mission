import { Request, Response, NextFunction } from 'express';
import * as notificationsService from '../services/notificationsService';
import { withAsync } from '../lib/withAsync';

export const getMyNotifications = withAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const notifications = await notificationsService.getUserNotifications(userId);
  res.send(notifications);
});

export const getUnreadCount = withAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const count = await notificationsService.getUnreadNotificationCount(userId);
  res.json({ count });
});

export const readNotification = withAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;

  const updated = await notificationsService.readNotification(Number(id), userId);
  res.send(updated);
});
