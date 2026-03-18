import type { Request, Response } from 'express';
import * as notificationService from '../services/notificationService.js';
import { UnauthorizedError } from '../../errors/customErrors.js';

// 로그인 사용자 ID 추출
function getRequesterId(req: Request): string {
  if (!req.user?.userId) {
    throw new UnauthorizedError('인증이 필요합니다.');
  }

  return req.user.userId;
}

// take query → number 변환
function parseTake(value: unknown): number | undefined {
  if (typeof value !== 'string' || value.trim() === '') {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

// isRead query → boolean 변환
function parseIsRead(value: unknown): boolean | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

// 알림 목록 조회
export async function getNotifications(req: Request, res: Response): Promise<void> {
  const requesterId = getRequesterId(req);

  const result = await notificationService.getNotifications({
    requesterId,
    query: {
      cursor: typeof req.query.cursor === 'string' ? req.query.cursor : undefined,
      take: parseTake(req.query.take),
      isRead: parseIsRead(req.query.isRead),
    },
  });

  res.status(200).json(result);
}

// 안읽음 개수 조회
export async function getUnreadCount(req: Request, res: Response): Promise<void> {
  const requesterId = getRequesterId(req);

  const result = await notificationService.getUnreadCount(requesterId);
  res.status(200).json(result);
}

// 알림 읽음 처리
export async function markAsRead(
    req: Request<{ notificationId: string }>,
    res: Response): Promise<void> {
  const requesterId = getRequesterId(req);

  const result = await notificationService.markAsRead({
    requesterId,
    notificationId: req.params.notificationId,
  });

  res.status(200).json(result);
}

// 전체 읽음 처리
export async function markAllAsRead(req: Request, res: Response): Promise<void> {
  const requesterId = getRequesterId(req);

  const result = await notificationService.markAllAsRead(requesterId);
  res.status(200).json(result);
}