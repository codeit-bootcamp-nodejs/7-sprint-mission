import { Request, Response } from 'express';
import * as s from 'superstruct';
import BadRequestError from '../lib/errors/BadRequestError'; //
import { notificationService } from '../services/notificationService';
import { GetNotificationsQuery, NotificationIdParams } from '../structs/notificationStruct';

export const notificationController = {
  //알림 목록 조회
  getNotifications: async (req: Request, res: Response) => {
    const [error, query] = s.validate(req.query, GetNotificationsQuery);
    if (error) {
      throw new BadRequestError('잘못된 쿼리 파라미터입니다.');
    }

    const userId = req.user.id; 
    const { cursor, limit } = query;

    const result = await notificationService.getNotifications(userId, cursor, limit);
    res.status(200).json(result);
  },

  //안 읽은 알림 개수 조회
  getUnreadCount: async (req: Request, res: Response) => {
    const userId = req.user.id;
    const count = await notificationService.getUnreadCount(userId);
    
    res.status(200).json({ count });
  },

  //알림 읽음 처리
  markAsRead: async (req: Request, res: Response) => {
    const [error, params] = s.validate(req.params, NotificationIdParams);
    if (error) {
      throw new BadRequestError('유효하지 않은 알림 ID입니다.');
    }

    const userId = req.user.id;
    const notificationId = params.id;

    await notificationService.markAsRead(notificationId, userId);
    
    res.status(204).send(); 
  },
};