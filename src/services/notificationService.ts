import { notificationRepository } from '../repositories/notificationRepository';
import { sendNotificationToUser } from '../lib/socket';
import NotFoundError from '../lib/errors/NotFoundError';
import ForbiddenError from '../lib/errors/ForbiddenError';

export const notificationService = {
  async createAndSend(userId: number, content: string, type: string, relatedId?: number) {
    const notification = await notificationRepository.create(userId, content, type, relatedId);
    sendNotificationToUser(userId, notification);
    return notification;
  },
  async getList(userId: number, page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;
    return await notificationRepository.findListByUserId(userId, skip, pageSize);
  },
  async getUnreadCount(userId: number) {
    return await notificationRepository.countUnread(userId);
  },
  async markAsRead(userId: number, notificationId: number) {
    const notification = await notificationRepository.findById(notificationId);

    if (!notification) {
      throw new NotFoundError('Notification', notificationId);
    }

    if (notification.userId !== userId) {
      throw new ForbiddenError('본인의 알림이 아닙니다.');
    }
    return await notificationRepository.markAsRead(notificationId);
  }
};