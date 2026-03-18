import type { NotificationDto, UnreadCountDto, GetNotificationsResultDto } from '../dtos/notification.dto.js';
import type { CreateNotificationInputDto, GetNotificationsQueryDto } from '../dtos/notification.dto.js';

import {
  NOTIFICATION_PAGE_DEFAULT_TAKE,
  NOTIFICATION_PAGE_MAX_TAKE,
  toNotificationDto,
} from '../dtos/notification.dto.js';

import {
  countUnreadNotifications,
  createNotification as createNotificationRepo,
  findNotificationsByUserId,
  makeNextCursor,
  markAllAsRead as markAllAsReadRepo,
  markNotificationAsRead as markNotificationAsReadRepo,
} from '../repositories/notification.repository.js';

import { BadRequestError, NotFoundError } from '../../errors/customErrors.js';

// 문자열 id -> bigint 변환
function toBigIntOrNull(value: unknown): bigint | null {
  if (typeof value !== 'string' || value.trim() === '') return null;

  try {
    return BigInt(value);
  } catch {
    return null;
  }
}

// take 기본값/최대값 보정
function normalizeTake(take?: number): number {
  if (typeof take !== 'number' || Number.isNaN(take) || take <= 0) {
    return NOTIFICATION_PAGE_DEFAULT_TAKE;
  }

  return Math.min(take, NOTIFICATION_PAGE_MAX_TAKE);
}

// 알림 목록 조회
export async function getNotifications(params: {
  requesterId: string;
  query: GetNotificationsQueryDto;
}): Promise<GetNotificationsResultDto> {
  const { requesterId, query } = params;

  // 요청자 id 검증
  const userId = toBigIntOrNull(requesterId);
  if (!userId) throw new BadRequestError();

  // take 값 보정
  const take = normalizeTake(query.take);

  // 다음 페이지 존재 여부 판단을 위해 take + 1개 조회
  const rows = await findNotificationsByUserId({
    userId,
    cursorToken: query.cursor,
    take: take + 1,
    isRead: query.isRead,
  });

  const hasNext = rows.length > take;
  const sliced = hasNext ? rows.slice(0, take) : rows;

  const items: NotificationDto[] = sliced.map(toNotificationDto);

  // 다음 페이지가 있으면 현재 페이지 마지막 row 기준으로 token 생성
  const nextCursor = hasNext
    ? makeNextCursor(sliced[sliced.length - 1] ?? null)
    : null;

  return { items, nextCursor };
}

// 안읽음 개수 조회
export async function getUnreadCount(requesterId: string): Promise<UnreadCountDto> {
  const userId = toBigIntOrNull(requesterId);
  if (!userId) throw new BadRequestError();

  const count = await countUnreadNotifications(userId);
  return { count };
}

// 알림 단건 읽음 처리
export async function markAsRead(params: {
  requesterId: string;
  notificationId: string;
}): Promise<NotificationDto> {
  const userId = toBigIntOrNull(params.requesterId);
  if (!userId) throw new BadRequestError();

  const notificationId = toBigIntOrNull(params.notificationId);
  if (!notificationId) throw new BadRequestError();

  const updated = await markNotificationAsReadRepo({
    userId,
    notificationId,
  });

  if (!updated) throw new NotFoundError();

  return toNotificationDto(updated);
}

// 전체 읽음 처리
export async function markAllAsRead(
  requesterId: string
): Promise<{ updatedCount: number }> {
  const userId = toBigIntOrNull(requesterId);
  if (!userId) throw new BadRequestError();

  const updatedCount = await markAllAsReadRepo(userId);
  return { updatedCount };
}

// 알림 생성
export async function createNotification(
  input: CreateNotificationInputDto
): Promise<NotificationDto> {
  const userId = toBigIntOrNull(input.userId);
  if (!userId) throw new BadRequestError();

  const created = await createNotificationRepo({
    userId,
    type: input.type,
    resourceType: input.resourceType,
    resourceId: input.resourceId,
    message: input.message,
  });

  return toNotificationDto(created);
}