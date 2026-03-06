// 알림 스키마 및 유효성 검사

import {
  Notification,
  NotificationType,
  PriceChangePayload,
  NewCommentPayload,
} from '../types/notification';

// 알림 생성 요청 스키마
export interface CreateNotificationRequest {
  userId: string;
  type: NotificationType;
  payload: PriceChangePayload | NewCommentPayload;
}

// 알림 읽음 처리 요청 스키마
export interface MarkAsReadRequest {
  userId: string;
}

// 알림 조회 쿼리 스키마
export interface NotificationQuerySchema {
  userId: string;
  page?: string | number;
  limit?: string | number;
}

// 가격 변동 알림 생성 헬퍼
export function createPriceChangeNotification(
  userId: string,
  productId: string,
  oldPrice: number,
  newPrice: number,
  productName?: string
): CreateNotificationRequest {
  return {
    userId,
    type: 'price_change',
    payload: {
      productId,
      productName,
      oldPrice,
      newPrice,
    },
  };
}

// 댓글 알림 생성 헬퍼
export function createNewCommentNotification(
  userId: string,
  postId: string,
  commenterId: string,
  commentText: string,
  postTitle?: string,
  commenterName?: string
): CreateNotificationRequest {
  return {
    userId,
    type: 'new_comment',
    payload: {
      postId,
      postTitle,
      commenterId,
      commenterName,
      commentText,
    },
  };
}

// 알림 유효성 검사
export function validateCreateNotificationRequest(
  data: any
): { valid: boolean; error?: string } {
  if (!data.userId) {
    return { valid: false, error: 'userId is required' };
  }

  if (!data.type || !['price_change', 'new_comment'].includes(data.type)) {
    return { valid: false, error: 'type must be price_change or new_comment' };
  }

  if (!data.payload) {
    return { valid: false, error: 'payload is required' };
  }

  if (data.type === 'price_change') {
    const payload = data.payload as PriceChangePayload;
    if (!payload.productId || payload.oldPrice === undefined || payload.newPrice === undefined) {
      return { valid: false, error: 'Invalid price_change payload' };
    }
  }

  if (data.type === 'new_comment') {
    const payload = data.payload as NewCommentPayload;
    if (!payload.postId || !payload.commenterId || !payload.commentText) {
      return { valid: false, error: 'Invalid new_comment payload' };
    }
  }

  return { valid: true };
}

// 쿼리 파라미터 파싱
export function parseNotificationQuery(query: NotificationQuerySchema) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(query.limit) || 20));

  return { page, limit };
}
