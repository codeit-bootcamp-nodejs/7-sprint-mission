import e from 'express';
import { prismaClient } from '../lib/prismaClient';
import { CursorPaginationParams } from '../types/pagenation';
import { NotificationType } from '@prisma/client';
import { Socket } from 'socket.io';

export async function getNotificationsByUserId(userId: number,params: CursorPaginationParams) {
  const {cursor,limit}= params;
  const where = {userId};
  
   const notificationWithCursor = await prismaClient.notification.findMany({
    where,
    take: limit + 1, 
    orderBy: { createdAt: 'desc' },
    cursor: cursor ? { id: cursor } : undefined,
  });

  const totalCount = await prismaClient.notification.count({ where });
  const unreadCount = await prismaClient.notification.count({ where: { ...where, read: false } });
  const notifications = notificationWithCursor.slice(0, limit);
  const cursorNotification = notificationWithCursor[notificationWithCursor.length - 1];
  const nextCursor = notificationWithCursor.length > limit ? cursorNotification.id : null;

  return { notifications, totalCount, unreadCount, nextCursor };
}


export async function createNotifications(userId: number, type: NotificationType , payload: object) {
    return prismaClient.notification.create({
    data: {
      userId,
      type,
      payload,
    },
  });
}


export async function createNotification(userId: number, type: NotificationType , payload: object) {
  return await prismaClient.notification.create({
    data: {
      userId,
      type,
      payload,
    },
  });
}   

export async function myNotificationAsRead(notificationId: number, userId: number) {
  return await prismaClient.notification.update({
    where: { id: notificationId , userId : userId },
    data: { read: true },
  });
}   
