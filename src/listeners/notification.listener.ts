import { eventEmitter } from '../event';
import { NotificationRepo } from '../repository/notification.repository';
import { NotificationList } from '../model/notification.model';
import { io } from '../server';
import {
  ArticleCommentCreatedEvent,
  ProductCommentCreatedEvent,
  ProductPriceChangedEvent,
} from '../types/notification.type';

const notificationRepo = new NotificationRepo();

// ----------------------------------------------------------------
// [기능: 게시글에 댓글이 달렸을 때 알림 생성]
// ----------------------------------------------------------------
eventEmitter.on(
  'articleCommentCreated',
  async ({ article, articleId }: ArticleCommentCreatedEvent) => {
    try {
      // 댓글이 달린 게시글의 소유자에게 알림을 생성합니다.
      const newNoti = await notificationRepo.createNotification({
        userId: article.userId,
        type: 'ARTICLE_COMMENT' as const,
        targetId: articleId,
        targetType: 'ARTICLE' as const,
        message: `${article.title} 게시글에 새로운 댓글이 달렸습니다.`,
      });

      // 생성된 알림 실시간 소켓 전송
      const serializedNoti = NotificationList.fromEntity(newNoti);
      io.to(`user_${article.userId.toString()}`).emit('newNotification', serializedNoti);
    } catch (e) {
      console.error('알림 생성 중 오류 발생:', e);
    }
  },
);

// ----------------------------------------------------------------
// [기능: 상품에 댓글이 달렸을 때 알림 생성]
// ----------------------------------------------------------------
eventEmitter.on(
  'productCommentCreated',
  async ({ product, productId }: ProductCommentCreatedEvent) => {
    try {
      // 댓글이 달린 상품의 소유자에게 알림을 생성합니다.
      const newNoti = await notificationRepo.createNotification({
        userId: product.userId,
        type: 'PRODUCT_COMMENT' as const,
        targetId: productId,
        targetType: 'PRODUCT' as const,
        message: `${product.name} 상품에 새로운 댓글이 달렸습니다.`,
      });

      // 생성된 알림 실시간 소켓 전송
      const serializedNoti = NotificationList.fromEntity(newNoti);
      io.to(`user_${product.userId.toString()}`).emit('newNotification', serializedNoti);
    } catch (e) {
      console.error('알림 생성 중 오류 발생:', e);
    }
  },
);

// ----------------------------------------------------------------
// [기능: 상품의 가격이 변경되었을 때 알림 생성]
// ----------------------------------------------------------------
eventEmitter.on('productPriceChanged', async ({ product }: ProductPriceChangedEvent) => {
  try {
    // 가격이 변경된 상품이 위시리스트에 담긴 유저들을 조회합니다.
    const userIds = await notificationRepo.findUsersWithProductInWishlist(product.productId);

    if (userIds.length === 0) return;

    // 찜한 모든 유저에게 병렬(Promise.all)로 알람 생성
    await Promise.all(
      userIds.map(async (userId) => {
        const newNoti = await notificationRepo.createNotification({
          userId: userId,
          type: 'PRICE_DROP' as const,
          targetId: product.productId,
          targetType: 'PRODUCT' as const,
          message: `찜하신 ${product.name} 상품의 가격이 ${product.price}원으로 변경되었습니다.`,
        });

        // 생성된 알람 실시간 소켓 전송
        const serializedNoti = NotificationList.fromEntity(newNoti);
        io.to(`user_${userId.toString()}`).emit('newNotification', serializedNoti);
      }),
    );
  } catch (e) {
    console.error('알림 생성 중 오류 발생:', e);
  }
});
