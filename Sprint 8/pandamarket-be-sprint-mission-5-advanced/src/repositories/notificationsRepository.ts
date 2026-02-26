import { PrismaClient, Notification, NotificationType } from '@prisma/client';
const prisma = new PrismaClient();

export const createNotification = async (data: {
  userId: number;
  type: NotificationType;
  content: string;
  productId?: number;
  articleId?: number;
}): Promise<Notification> => {
  return await prisma.notification.create({
    data,
  });
};

export const getNotificationsByUserId = async (userId: number): Promise<Notification[]> => {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const getUnreadCount = async (userId: number): Promise<number> => {
  return await prisma.notification.count({
    where: { userId, isRead: false },
  });
};

export const markAsRead = async (id: number, userId: number): Promise<Notification> => {
  return await prisma.notification.update({
    where: { id, userId },
    data: { isRead: true },
  });
};
