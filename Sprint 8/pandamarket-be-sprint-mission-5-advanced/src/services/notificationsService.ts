import * as notificationsRepository from '../repositories/notificationsRepository';
import { getIO } from '../lib/socket';
import { NotificationType } from '@prisma/client';

export const sendNotification = async (params: {
  userId: number;
  type: NotificationType;
  content: string;
  productId?: number;
  articleId?: number;
}) => {
  const notification = await notificationsRepository.createNotification(params);
  const io = getIO();
  io.to(`user_${params.userId}`).emit('newNotification', notification);

  return notification;
};

export const getUserNotifications = notificationsRepository.getNotificationsByUserId;
export const getUnreadNotificationCount = notificationsRepository.getUnreadCount;
export const readNotification = notificationsRepository.markAsRead;
