// 알림 타입 정의

export type NotificationType = 'price_change' | 'new_comment';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  payload: PriceChangePayload | NewCommentPayload;
  isRead: boolean;
  createdAt: string;
}

export interface PriceChangePayload {
  productId: string;
  productName?: string;
  oldPrice: number;
  newPrice: number;
}

export interface NewCommentPayload {
  postId: string;
  postTitle?: string;
  commenterId: string;
  commenterName?: string;
  commentText: string;
}

export interface NotificationQuery {
  page?: number;
  limit?: number;
}

export interface UnreadCountResponse {
  unread: number;
}

export interface NotificationsListResponse {
  data: Notification[];
  page: number;
  limit: number;
  total: number;
}
