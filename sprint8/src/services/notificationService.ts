
import BadRequestError from "../lib/errors/BadRequestError";
import ForbiddenError from "../lib/errors/ForbiddenError";
import NotFoundError from "../lib/errors/NotFoundError";
import { notificationRepository } from "../repositories/notificationRepository";
import { sendNotificationToUser } from "../socket";
import { CreateNotificationParams, GetNotificationsResponse } from "../types/Notification";


export const notificationService = {

  //알림 생성 및 실시간 전송
  async createProductNotification(params: CreateNotificationParams) { 
  if (!params.userId || !params.content || !params.type) {
    throw new BadRequestError("알림 생성에 필요한 정보가 부족합니다.");
  }
  const notification = await notificationRepository.createNotification(params);

  sendNotificationToUser(params.userId, notification);
  
  return notification;
},

  // 알림 목록 조회
  async getNotifications(userId: number, cursor?: number, limit: number = 10): Promise<GetNotificationsResponse> {
    if (limit <= 0 || limit > 50) {
      throw new BadRequestError("limit은 1에서 50 사이의 숫자여야 합니다.");
    }
    const notifications = await notificationRepository.getNotifications(userId, cursor, limit);
    const nextCursor = notifications.length === limit ? notifications[notifications.length - 1].id : null;

    return { list: notifications, nextCursor };
  },

  // 안 읽은 알림 개수 조회
  async getUnreadCount(userId: number) {
    return await notificationRepository.getUnreadCount(userId);
  },

  // 알림 읽음 처리
  async markAsRead(notificationId: number, userId: number) {
    const notification = await notificationRepository.findById(notificationId);
    
    if (!notification) {
      throw new NotFoundError("해당 알림을 찾을 수 없습니다.");
    }
    if (notification.userId !== userId) {
      throw new ForbiddenError("해당 알림에 대한 권한이 없습니다.");
    }

    return await notificationRepository.updateReadStatus(notificationId, userId);
  },

  // 알림 생성
  async createNotification(params: CreateNotificationParams) {
    if (!params.userId || !params.content || !params.type) {
      throw new BadRequestError("알림 생성에 필요한 정보가 부족합니다.");
    }
    return await notificationRepository.createNotification(params);
  },
};