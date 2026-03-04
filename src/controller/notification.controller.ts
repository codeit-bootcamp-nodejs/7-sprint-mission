import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../service/notification.service';
import { Notificationparams } from '../types/notification.type';

export class NotificationController {
  private notificationService = new NotificationService();

  getNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = BigInt(req.user!.userId);
      const notifications = await this.notificationService.getNotifications(userId);
      res.status(200).json({ notifications });
    } catch (e) {
      next(e);
    }
  };

  getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = BigInt(req.user!.userId);
      const unreadCount = await this.notificationService.getUnreadCount(userId);
      res.status(200).json({ unreadCount });
    } catch (e) {
      next(e);
    }
  };

  markAsRead = async (req: Request<Notificationparams>, res: Response, next: NextFunction) => {
    try {
      const userId = BigInt(req.user!.userId);
      const notificationId = BigInt(req.params.notificationId);
      await this.notificationService.markAsRead(userId, notificationId);
      res.status(200).json({ message: '알림이 읽음 처리되었습니다.' });
    } catch (e) {
      next(e);
    }
  };
}
