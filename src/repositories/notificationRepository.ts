import { prisma } from '../lib/prismaClient';

export const notificationRepository = {
  async create(userId: number, content: string, type: string, relatedId?: number) {
    return await prisma.notification.create({
      data: { userId, content, type, relatedId }
    });
  },

  async findById(id: number) {
    return await prisma.notification.findUnique({
      where: { id }
    });
  },
  
  async findListByUserId(userId: number, skip: number, take: number) {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  },
  async countUnread(userId: number) {
    return await prisma.notification.count({
      where: { userId, isRead: false }
    });
  },
  async markAsRead(id: number) {
    return await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
  }
};