// 클라이언트 측 알림 서비스 예제
// 브라우저 또는 React/Vue 등의 프레임워크에서 사용 가능

import { io, Socket } from 'socket.io-client';

interface Notification {
  id: string;
  userId: string;
  type: 'price_change' | 'new_comment';
  payload: any;
  isRead: boolean;
  createdAt: string;
}

interface NotificationServiceConfig {
  serverUrl: string;
  reconnection?: boolean;
  reconnectionDelay?: number;
}

export class NotificationService {
  private socket: Socket | null = null;
  private userId: string | null = null;
  private serverUrl: string;
  private listeners: Map<string, Function[]> = new Map();

  constructor(config: NotificationServiceConfig) {
    this.serverUrl = config.serverUrl;
  }

  // 서버에 연결하고 사용자 ID 등록
  connect(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userId = userId;

      this.socket = io(this.serverUrl, {
        reconnection: true,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        console.log('Connected to notification server');
        this.socket!.emit('join', userId);
        resolve();
      });

      this.socket.on('connect_error', (error: any) => {
        console.error('Connection error:', error);
        reject(error);
      });

      // 새 알림 수신
      this.socket.on('notification', (notification: Notification) => {
        console.log('New notification:', notification);
        this.emit('notification', notification);
      });

      // 읽지 않은 알림 개수 업데이트
      this.socket.on('unread-count', (data: { unread: number }) => {
        console.log('Unread count:', data.unread);
        this.emit('unread-count', data);
      });

      // 읽지 않은 알림 목록
      this.socket.on('unread-notifications', (notifications: Notification[]) => {
        console.log('Unread notifications:', notifications);
        this.emit('unread-notifications', notifications);
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from notification server');
        this.emit('disconnect');
      });
    });
  }

  // 서버에서 연결 해제
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // 알림 목록 조회 (HTTP 요청)
  async getNotifications(page: number = 1, limit: number = 20): Promise<any> {
    const response = await fetch(
      `${this.serverUrl}/api/notifications?userId=${this.userId}&page=${page}&limit=${limit}`
    );
    return response.json();
  }

  // 읽지 않은 알림 개수 조회 (HTTP 요청)
  async getUnreadCount(): Promise<number> {
    const response = await fetch(
      `${this.serverUrl}/api/notifications/unread-count?userId=${this.userId}`
    );
    const data = await response.json() as any;
    return data.unread;
  }

  // 알림 읽음 처리 (HTTP 요청)
  async markAsRead(notificationId: string): Promise<any> {
    const response = await fetch(`${this.serverUrl}/api/notifications/${notificationId}/read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: this.userId }),
    });
    return response.json();
  }

  // 모든 알림 읽음 처리 (Socket.IO)
  markAllAsRead(): void {
    if (!this.socket) return;
    this.socket.emit('mark-all-as-read', { userId: this.userId }, (response: any) => {
      console.log('Mark all as read response:', response);
      this.emit('mark-all-as-read', response);
    });
  }

  // 특정 알림 읽음 처리 (Socket.IO)
  markNotificationAsRead(notificationId: string): void {
    if (!this.socket) return;
    this.socket.emit(
      'mark-as-read',
      { userId: this.userId, notificationId },
      (response: any) => {
        console.log('Mark as read response:', response);
        this.emit('mark-as-read', response);
      }
    );
  }

  // 이벤트 리스너 등록
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  // 이벤트 리스너 제거
  off(event: string, callback?: Function): void {
    if (!this.listeners.has(event)) return;

    if (callback) {
      const callbacks = this.listeners.get(event)!;
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    } else {
      this.listeners.delete(event);
    }
  }

  // 이벤트 발생
  private emit(event: string, data?: any): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => callback(data));
  }

  // 연결 상태 확인
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// 사용 예제
export async function exampleUsage() {
  const notificationService = new NotificationService({
    serverUrl: 'http://localhost:3000',
  });

  // 서버에 연결
  try {
    await notificationService.connect('user123');
    console.log('Connected successfully');
  } catch (error) {
    console.error('Connection failed:', error);
    return;
  }

  // 이벤트 리스너 등록
  notificationService.on('notification', (notification: Notification) => {
    console.log('Received notification:', notification);

    if (notification.type === 'price_change') {
      const payload = notification.payload;
      console.log(`가격 변동: ${payload.productName} - ${payload.oldPrice} → ${payload.newPrice}`);
    } else if (notification.type === 'new_comment') {
      const payload = notification.payload;
      console.log(`새 댓글: ${payload.commenterName}이(가) 댓글을 달았습니다`);
    }
  });

  notificationService.on('unread-count', (data: { unread: number }) => {
    console.log(`읽지 않은 알림: ${data.unread}개`);
  });

  // 알림 목록 조회
  const notificationsResponse = await notificationService.getNotifications(1, 20);
  console.log('Notifications:', notificationsResponse);

  // 읽지 않은 알림 개수 조회
  const unreadCount = await notificationService.getUnreadCount();
  console.log('Unread count:', unreadCount);

  // 알림 읽음 처리
  // await notificationService.markAsRead('notification-id');

  // 모든 알림 읽음 처리
  // notificationService.markAllAsRead();
}
