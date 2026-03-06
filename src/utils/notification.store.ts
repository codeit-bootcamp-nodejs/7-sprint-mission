// 인메모리 알림 저장소
// 실제 프로덕션에서는 데이터베이스를 사용해야 합니다

import { Notification } from '../types/notification';

class NotificationStore {
  private notifications: Notification[] = [];

  // 알림 추가
  add(notification: Notification): Notification {
    this.notifications.push(notification);
    return notification;
  }

  // 사용자 ID로 알림 조회
  findByUserId(userId: string, page: number = 1, limit: number = 20): {
    data: Notification[];
    total: number;
  } {
    const filtered = this.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = filtered.length;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return { data, total };
  }

  // 알림 ID로 알림 조회
  findById(id: string): Notification | undefined {
    return this.notifications.find(n => n.id === id);
  }

  // 알림 읽음 처리
  markAsRead(id: string, userId: string): Notification | null {
    const notification = this.notifications.find(n => n.id === id && n.userId === userId);
    if (notification) {
      notification.isRead = true;
    }
    return notification || null;
  }

  // 사용자의 읽지 않은 알림 개수
  getUnreadCount(userId: string): number {
    return this.notifications.filter(n => n.userId === userId && !n.isRead).length;
  }

  // 사용자의 읽지 않은 알림 목록
  getUnreadNotifications(userId: string): Notification[] {
    return this.notifications
      .filter(n => n.userId === userId && !n.isRead)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // 모든 알림 조회 (개발/테스트용)
  getAll(): Notification[] {
    return [...this.notifications];
  }

  // 저장소 초기화 (테스트용)
  clear(): void {
    this.notifications = [];
  }
}

export const notificationStore = new NotificationStore();
