import { prismaClient } from "../lib/prismaClient";
import { CreateNotificationParams } from "../types/Notification";

export const notificationRepository = {
  // 알림 목록 조회 (커서 페이지네이션)
  async getNotifications(userId: number, cursor?: number, limit: number = 10) {
    return await prismaClient.notification.findMany({
      where: { userId },
      take: limit,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
      orderBy: { id: "desc" },
    });
  },

  // 알림 생성
  async createNotification(data: CreateNotificationParams) {
    return await prismaClient.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        content: data.content,
        link: data.link,
      },
    });
  },

  // 단일 알림 조회
  async findById(id: number) {
    return await prismaClient.notification.findUnique({
      where: { id },
    });
  },

  // 안 읽은 알림 개수 조회
  async getUnreadCount(userId: number) {
    return await prismaClient.notification.count({
      where: {
        userId: userId,
        isRead: false,
      },
    });
  },

  // 알림 읽음 처리
  async updateReadStatus(id: number, userId: number) {
    return await prismaClient.notification.update({
      where: {
        id,
        userId: userId,
      },
      data: {
        isRead: true,
      },
    });
  },
};