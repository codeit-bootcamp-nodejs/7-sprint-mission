import prisma from '../lib/prismaClient';
import { NotificationType } from '@prisma/client';

export async function findNotificationsByUserId(params: {
  userId: number;
  cursor?: number;
  limit: number;
}) {
  const { userId, cursor, limit } = params;
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
  });
}

export async function countUnreadNotifications(userId: number) {
  return prisma.notification.count({ where: { userId, read: false } });
}

export async function findNotificationById(id: number) {
  return prisma.notification.findUnique({ where: { id } });
}

export async function createNotification(data: {
  userId: number;
  type: NotificationType;
  payload: object;
}) {
  return prisma.notification.create({ data: { ...data, payload: data.payload } });
}

export async function markNotificationRead(id: number) {
  return prisma.notification.update({ where: { id }, data: { read: true } });
}
