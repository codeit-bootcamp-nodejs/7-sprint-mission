import { Notification, NotificationType } from '@prisma/client';

export interface PriceChangedPayload {
  productId: number;
  productName: string;
  oldPrice: number;
  newPrice: number;
}

export interface NewCommentPayload {
  articleId: number;
  articleTitle: string;
  commentId: number;
  commenterNickname: string;
}

export type NotificationPayload = PriceChangedPayload | NewCommentPayload;

export function toNotificationDto(notification: Notification) {
  return {
    id: notification.id,
    userId: notification.userId,
    type: notification.type,
    payload: notification.payload,
    read: notification.read,
    createdAt: notification.createdAt,
    updatedAt: notification.updatedAt,
  };
}
