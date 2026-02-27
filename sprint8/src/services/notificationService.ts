import { CursorPaginationParams } from "../types/pagenation";
import * as notificationRepository from '../repositories/notificationRepository';
import { Notification, NotificationType } from "@prisma/client";
export async function getNotifications(userId: number, params: CursorPaginationParams) {
  const { cursor, limit } = params;
  const { notifications, totalCount, unreadCount, nextCursor } = await notificationRepository.getNotificationsByUserId(userId, { cursor, limit });
  return { list:notifications, totalCount, unreadCount, nextCursor };
}


export async function createNotifications(notifications: { userId: number; type: NotificationType; payload: object }[]) {
  const result: Notification[] = [];
  for (const notification of notifications) {
    const row = await notificationRepository.createNotifications(notification.userId, notification.type, notification.payload);
    result.push(row);
  }
  return result;
}

export async function createNotification(notification:{userId: number; type: NotificationType; payload: object}) {
  return await notificationRepository.createNotification(notification.userId, notification.type, notification.payload);
}

export async function markNotificationAsRead(notificationId: number) {
  return await notificationRepository.myNotificationAsRead(notificationId);
}       