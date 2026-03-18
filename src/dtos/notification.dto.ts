import type { Notification, NotificationResourceType, NotificationType } from '@prisma/client';

export const NOTIFICATION_PAGE_DEFAULT_TAKE = 20;
export const NOTIFICATION_PAGE_MAX_TAKE = 50;

// API 응답
export type NotificationDto = {
  id: string;
  userId: string;

  type: NotificationType;
  resourceType: NotificationResourceType;
  resourceId: string;

  message: string;

  isRead: boolean;
  readAt: string | null;

  createdAt: string;
};

// 목록 조회 Query (base64 continuation token)
export type GetNotificationsQueryDto = {
  cursor?: string;
  take?: number;
  isRead?: boolean;
};

// 목록 조회 Result
export type GetNotificationsResultDto = {
  items: NotificationDto[];
  nextCursor: string | null;
};

// 안읽음 응답
export type UnreadCountDto = { count: number };

export type MarkAsReadParamsDto = {
  notificationId: string;
};

// 알림 생성 입력
export type CreateNotificationInputDto = {
  userId: string;

  type: NotificationType;
  resourceType: NotificationResourceType;
  resourceId: string;

  message: string;
};

// 프리즈마 -> API DTO 변환
export function toNotificationDto(n: Pick<
  Notification,
  | 'id'
  | 'user_id'
  | 'type'
  | 'resourceType'
  | 'resourceId'
  | 'message'
  | 'isRead'
  | 'readAt'
  | 'createdAt'
>): NotificationDto {
  return {
    id: n.id.toString(),
    userId: n.user_id.toString(),

    type: n.type,
    resourceType: n.resourceType,
    resourceId: n.resourceId,

    message: n.message,

    isRead: n.isRead,
    readAt: n.readAt ? n.readAt.toISOString() : null,

    createdAt: n.createdAt.toISOString(),
  };
}