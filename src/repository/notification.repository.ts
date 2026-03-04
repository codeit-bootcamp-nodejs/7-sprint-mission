import prisma from '../../prisma/prisma';
import { CreateNotificationDto } from '../types/notification.type';

export class NotificationRepo {
  /**
   * 유저가 자신의 알람을 조회합니다.
   * @param userId 알람을 받을 유저 ID
   * @returns 유저의 알람 전체
   */
  getNotifications = async (userId: bigint) => {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return notifications;
  };

  /**
   * 유저가 읽지 않을 알람의 개수를 조회합니다
   * @param userId 알람을 받을 유저 ID
   * @returns 읽지 않은 알람 개수
   */
  getUnreadCount = async (userId: bigint) => {
    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false },
    });

    return unreadCount;
  };

  /**
   * 유저가 특정 알람을 읽음 상태로 변경합니다.
   * @param userId 알람을 받을 유저 ID
   * @param notificationId 읽음 상태로 변경할 알람 ID
   */
  markAsRead = async (userId: bigint, notificationId: bigint) => {
    await prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  };

  /**
   * 알람을 생성 합니다.
   * @param notificationData 알람 생성에 필요한 데이터
   * @returns 생성된 알람 데이터
   */
  createNotification = async (notificationData: CreateNotificationDto) => {
    const newNotification = await prisma.notification.create({
      data: notificationData,
    });
    return newNotification;
  };

  /**
   * 특정 상품이 위시리스트에 추가된 유저들을 조회합니다.
   * @param productId 특정 상품 ID
   * @returns 위시리스트에 추가된 유저 ID 목록
   */
  findUsersWithProductInWishlist = async (productId: bigint) => {
    const wishlists = await prisma.productLike.findMany({
      where: { productId },
      select: { userId: true },
    });
    return wishlists.map((wish) => wish.userId);
  };
}
