// 알림 컨트롤러
// 알림 관련 비즈니스 로직 처리

import { Notification } from '../types/notification';
import { notificationStore } from '../utils/notification.store';
import { socketManager } from '../utils/socket.manager';
import { Server as IOServer } from 'socket.io';
import {
  CreateNotificationRequest,
  createPriceChangeNotification,
  createNewCommentNotification,
} from '../schemas/notification.schema';

let io: IOServer;

// Socket.IO 인스턴스 설정
export function setIOInstance(ioInstance: IOServer): void {
  io = ioInstance;
}

// 알림 생성 및 전송
export function notifyUser(
  userId: string,
  type: 'price_change' | 'new_comment',
  payload: any
): Notification {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const createdAt = new Date().toISOString();

  const notification: Notification = {
    id,
    userId,
    type,
    payload,
    isRead: false,
    createdAt,
  };

  // 저장소에 저장
  notificationStore.add(notification);

  // 실시간 전송
  emitToUser(userId, 'notification', notification);

  // 읽지 않은 알림 개수 업데이트
  const unreadCount = notificationStore.getUnreadCount(userId);
  emitToUser(userId, 'unread-count', { unread: unreadCount });

  return notification;
}

// 사용자에게 이벤트 전송
export function emitToUser(userId: string, event: string, data: any): void {
  if (!io) {
    console.warn('Socket.IO instance not initialized');
    return;
  }

  const socketIds = socketManager.getUserSockets(userId);
  for (const socketId of socketIds) {
    io.to(socketId).emit(event, data);
  }
}

// 알림 목록 조회
export function getNotifications(
  userId: string,
  page: number = 1,
  limit: number = 20
): {
  data: Notification[];
  page: number;
  limit: number;
  total: number;
} {
  const { data, total } = notificationStore.findByUserId(userId, page, limit);

  return {
    data,
    page,
    limit,
    total,
  };
}

// 읽지 않은 알림 개수 조회
export function getUnreadCount(userId: string): number {
  return notificationStore.getUnreadCount(userId);
}

// 읽지 않은 알림 목록 조회
export function getUnreadNotifications(userId: string): Notification[] {
  return notificationStore.getUnreadNotifications(userId);
}

// 알림 읽음 처리
export function markNotificationAsRead(notificationId: string, userId: string): Notification | null {
  const notification = notificationStore.markAsRead(notificationId, userId);

  if (notification) {
    // 읽지 않은 알림 개수 업데이트
    const unreadCount = notificationStore.getUnreadCount(userId);
    emitToUser(userId, 'unread-count', { unread: unreadCount });
  }

  return notification;
}

// 상품 가격 변동 알림 발송
// 해당 상품을 찜한 사용자들에게 알림
export async function onProductPriceChange(
  productId: string,
  oldPrice: number,
  newPrice: number,
  productName?: string,
  likedUserIds?: string[]
): Promise<void> {
  // 실제 구현에서는 데이터베이스에서 찜한 사용자 조회
  const userIds = likedUserIds || (await findUsersWhoLikedProduct(productId));

  for (const userId of userIds) {
    notifyUser(userId, 'price_change', {
      productId,
      productName,
      oldPrice,
      newPrice,
    });
  }
}

// 댓글 알림 발송
// 게시글 작성자에게 새 댓글을 알림
export async function onNewComment(
  postId: string,
  commenterId: string,
  commentText: string,
  postTitle?: string,
  commenterName?: string
): Promise<void> {
  // 실제 구현에서는 데이터베이스에서 게시글 작성자 조회
  const authorId = await findPostAuthor(postId);

  // 자신의 게시글에 자신이 댓글을 단 경우는 알림 없음
  if (!authorId || authorId === commenterId) {
    return;
  }

  notifyUser(authorId, 'new_comment', {
    postId,
    postTitle,
    commenterId,
    commenterName,
    commentText,
  });
}

// 상품을 찜한 사용자 ID 목록 조회
// TODO: 데이터베이스 연동 필요
async function findUsersWhoLikedProduct(productId: string): Promise<string[]> {
  // 플레이스홀더 구현
  // 실제로는 데이터베이스에서 조회
  return [];
}

// 게시글 작성자 ID 조회
// TODO: 데이터베이스 연동 필요
async function findPostAuthor(postId: string): Promise<string | null> {
  // 플레이스홀더 구현
  // 실제로는 데이터베이스에서 조회
  return null;
}
