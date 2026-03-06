import { NotificationType } from '@prisma/client';
import * as notificationRepository from '../repositories/notificationRepository';
import { toNotificationDto, PriceChangedPayload, NewCommentPayload } from '../dto/notificationDto';
import socketService from './socketService';

export async function getNotifications(params: {
  userId: number;
  cursor?: number;
  limit: number;
}) {
  const notifications = await notificationRepository.findNotificationsByUserId(params);
  const nextCursor =
    notifications.length === params.limit
      ? notifications[notifications.length - 1].id
      : undefined;

  return {
    list: notifications.map(toNotificationDto),
    nextCursor,
  };
}

export async function getUnreadCount(userId: number) {
  return notificationRepository.countUnreadNotifications(userId);
}

export async function markAsRead(id: number, userId: number) {
  const notification = await notificationRepository.findNotificationById(id);
  if (!notification) {
    const error = new Error('알림을 찾을 수 없습니다');
    (error as any).status = 404;
    throw error;
  }
  if (notification.userId !== userId) {
    const error = new Error('권한이 없습니다');
    (error as any).status = 403;
    throw error;
  }
  const updated = await notificationRepository.markNotificationRead(id);
  return toNotificationDto(updated);
}

export async function sendPriceChangedNotification(
  payload: PriceChangedPayload,
  userIds: number[]
) {
  for (const userId of userIds) {
    const notification = await notificationRepository.createNotification({
      userId,
      type: NotificationType.PRICE_CHANGED,
      payload: payload as unknown as object,
    });
    socketService.emitToUser(userId, 'notification', toNotificationDto(notification));
  }
}

export async function sendNewCommentNotification(
  payload: NewCommentPayload,
  userId: number
) {
  const notification = await notificationRepository.createNotification({
    userId,
    type: NotificationType.NEW_COMMENT,
    payload: payload as unknown as object,
  });
  socketService.emitToUser(userId, 'notification', toNotificationDto(notification));
}
