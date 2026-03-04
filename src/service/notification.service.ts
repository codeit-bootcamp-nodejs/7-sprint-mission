import { NotificationRepo } from '../repository/notification.repository';
import { NotificationList } from '../model/notification.model';

export class NotificationService {
  private notificationRepo = new NotificationRepo();

  getNotifications = async (userId: bigint) => {
    const notifications = await this.notificationRepo.getNotifications(userId);
    return notifications.map((notification) => NotificationList.fromEntity(notification));
  };

  getUnreadCount = async (userId: bigint) => {
    const unreadCount = await this.notificationRepo.getUnreadCount(userId);
    return unreadCount;
  };

  markAsRead = async (userId: bigint, notificationId: bigint) => {
    await this.notificationRepo.markAsRead(userId, notificationId);
  };
}
