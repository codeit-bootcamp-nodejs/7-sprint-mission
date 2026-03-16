import { CursorPaginationParams } from "../types/pagenation";
import * as notificationRepository from '../repositories/notificationRepository';
import { Notification, NotificationType } from "@prisma/client";
import { prismaClient } from "../lib/prismaClient";
export async function getNotifications(userId: number, params: CursorPaginationParams) {
  const { cursor, limit } = params;
  const { notifications, totalCount, unreadCount, nextCursor } = await notificationRepository.getNotificationsByUserId(userId, { cursor, limit });
  return { list:notifications, totalCount, unreadCount, nextCursor };
}


export async function createNotifications(notifications: { userId: number; type: NotificationType; payload: object }[]) {
  
  const dataToCreate = notifications.map(notification => ({
    userId: notification.userId,
    type: notification.type,
    payload: notification.payload,
  }));
  const result = await prismaClient.notification.createMany({ data: dataToCreate });
  return result;
}

export async function createNotification(notification:{userId: number; type: NotificationType; payload: object}) {
  return await notificationRepository.createNotification(notification.userId, notification.type, notification.payload);
}

export async function markNotificationAsRead(notificationId: number, userId: number) {
  return await notificationRepository.myNotificationAsRead(notificationId, userId);
}       