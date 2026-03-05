import { NotificationType } from "@prisma/client"; 
export { NotificationType };

export interface Notification {
  id: number;
  type: NotificationType;
  content: string;
  isRead: boolean;
  link: string | null;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}


export interface CreateNotificationParams {
  userId: number;
  type: NotificationType;
  content: string;
  link?: string;
}

export interface GetNotificationsResponse {
  list: Notification[];
  nextCursor: number | null;
}

export interface INotificationService {
  getNotifications(userId: number, cursor?: number, limit?: number): Promise<GetNotificationsResponse>;
  getUnreadCount(userId: number): Promise<number>;
  markAsRead(notificationId: number, userId: number): Promise<void>;
  createNotification(params: CreateNotificationParams): Promise<Notification>;
}