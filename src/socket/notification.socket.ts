// Socket.IO 이벤트 핸들러
// 실시간 알림 통신 처리

import { Socket, Server as IOServer } from 'socket.io';
import { socketManager } from '../utils/socket.manager';
import { notificationStore } from '../utils/notification.store';
import { emitToUser } from '../controllers/notification.controller';

// Socket.IO 연결 핸들러 초기화
export function initializeSocketHandlers(io: IOServer): void {
  io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // 사용자가 연결되었을 때
    // 클라이언트는 'join' 이벤트로 userId를 전송
    socket.on('join', (userId: string) => {
      if (!userId) {
        console.warn('join event without userId');
        return;
      }

      socketManager.addSocket(userId, socket.id);
      console.log(`User ${userId} joined with socket ${socket.id}`);

      // 읽지 않은 알림 개수 전송
      const unreadCount = notificationStore.getUnreadCount(userId);
      socket.emit('unread-count', { unread: unreadCount });

      // 읽지 않은 알림 목록 전송
      const unreadNotifications = notificationStore.getUnreadNotifications(userId);
      socket.emit('unread-notifications', unreadNotifications);
    });

    // 알림 읽음 처리 요청
    socket.on('mark-as-read', (data: { userId: string; notificationId: string }, callback) => {
      const { userId, notificationId } = data;

      if (!userId || !notificationId) {
        if (callback) callback({ success: false, error: 'userId and notificationId required' });
        return;
      }

      const notification = notificationStore.markAsRead(notificationId, userId);

      if (!notification) {
        if (callback) callback({ success: false, error: 'Notification not found' });
        return;
      }

      // 읽지 않은 알림 개수 업데이트
      const unreadCount = notificationStore.getUnreadCount(userId);
      emitToUser(userId, 'unread-count', { unread: unreadCount });

      if (callback) {
        callback({ success: true, notification });
      }
    });

    // 모든 알림 읽음 처리
    socket.on('mark-all-as-read', (data: { userId: string }, callback) => {
      const { userId } = data;

      if (!userId) {
        if (callback) callback({ success: false, error: 'userId required' });
        return;
      }

      const unreadNotifications = notificationStore.getUnreadNotifications(userId);

      for (const notification of unreadNotifications) {
        notificationStore.markAsRead(notification.id, userId);
      }

      // 읽지 않은 알림 개수 업데이트
      const unreadCount = notificationStore.getUnreadCount(userId);
      emitToUser(userId, 'unread-count', { unread: unreadCount });

      if (callback) {
        callback({ success: true, count: unreadNotifications.length });
      }
    });

    // 소켓 연결 해제
    socket.on('disconnect', () => {
      const userId = socketManager.removeSocket(socket.id);
      if (userId) {
        console.log(`User ${userId} disconnected (socket: ${socket.id})`);
      } else {
        console.log(`Socket ${socket.id} disconnected`);
      }
    });

    // 에러 처리
    socket.on('error', (error) => {
      console.error(`Socket error (${socket.id}):`, error);
    });
  });
}
