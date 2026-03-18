import { prisma } from '../../prisma/prisma.js';
import type { Notification, Prisma } from '@prisma/client';
import {
  buildCursorWhere,
  createContinuationToken,
  orderByToSort,
  parseContinuationToken,
  type Sort,
} from '../../utils/cursor-pagination.js';

export type FindNotificationsParams = {
  userId: bigint;
  cursorToken?: string;
  take: number;
  isRead?: boolean;
};

const NOTIFICATION_ORDER_BY = [{ createdAt: 'desc' }, { id: 'desc' }] as const;
const NOTIFICATION_SORT: Sort = orderByToSort([...NOTIFICATION_ORDER_BY]);

type NotificationCursorData = {
  createdAt: string;
  id: bigint;
  user_id: bigint;
};

// 알림 목록 조회
export async function findNotificationsByUserId(
    params: FindNotificationsParams
): Promise<Notification[]> {

  const { userId, take, cursorToken, isRead } = params;

  // cursorToken 파싱
  const parsed = cursorToken
    ? parseContinuationToken<NotificationCursorData>(cursorToken, ['id', 'user_id'])
    : null;

  const cursorWhere =
    parsed && JSON.stringify(parsed.sort) === JSON.stringify(NOTIFICATION_SORT)
      ? buildCursorWhere(parsed.data, NOTIFICATION_SORT)
      : {};

  const where: Prisma.NotificationWhereInput = {
    user_id: userId,
    ...(typeof isRead === 'boolean' ? { isRead } : {}),
    ...(cursorWhere as Prisma.NotificationWhereInput),
  };

  return prisma.notification.findMany({
    where,
    orderBy: [...NOTIFICATION_ORDER_BY],
    take,
  });
}

// nextCursor 토큰 생성
export function makeNextCursor(
  last: Pick<Notification, 'createdAt' | 'id' | 'user_id'> | null
): string | null {
  if (!last) return null;

  return createContinuationToken<NotificationCursorData>(
    {
      createdAt: last.createdAt.toISOString(),
      id: last.id,
      user_id: last.user_id,
    },
    NOTIFICATION_SORT
  );
}

// 안읽음 개수 조회
export async function countUnreadNotifications(userId: bigint): Promise<number> {
  return prisma.notification.count({
    where: { user_id: userId, isRead: false },
  });
}

// 알림 읽음 처리
export async function markNotificationAsRead(params: {
  userId: bigint;
  notificationId: bigint;
}): Promise<Notification | null> {
  const { userId, notificationId } = params;

  return prisma.$transaction(async (tx) => {
    const existing = await tx.notification.findFirst({
      where: { id: notificationId, user_id: userId },
    });

    if (!existing) return null;
    if (existing.isRead) return existing;

    // 안읽음 업데이트
    await tx.notification.updateMany({
      where: { id: notificationId, user_id: userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });

    // 업데이트 후 최신 상태 반환
    return tx.notification.findFirst({
      where: { id: notificationId, user_id: userId },
    });
  });
}

// 알림 생성
export async function createNotification(data: {
  userId: bigint;
  type: Notification['type'];
  resourceType: Notification['resourceType'];
  resourceId: string;
  message: string;
}): Promise<Notification> {
  const { userId, type, resourceType, resourceId, message } = data;

  return prisma.notification.create({
    data: {
      user: { connect: { id: userId } },
      type,
      resourceType,
      resourceId,
      message,
    },
  });
}

// 전체 읽음 처리
export async function markAllAsRead(userId: bigint): Promise<number> {
  const result = await prisma.notification.updateMany({
    where: { user_id: userId, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });

  return result.count;
}