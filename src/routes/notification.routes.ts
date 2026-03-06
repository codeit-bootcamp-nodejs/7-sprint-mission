// 알림 API 라우트

import express, { Router, Request, Response } from 'express';
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  onProductPriceChange,
  onNewComment,
} from '../controllers/notification.controller';
import {
  parseNotificationQuery,
  validateCreateNotificationRequest,
} from '../schemas/notification.schema';

const router = Router();

// GET /api/notifications
// 사용자의 알림 목록 조회
// 쿼리 파라미터: userId, page, limit
router.get('/api/notifications', (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required',
      });
    }

    const { page, limit } = parseNotificationQuery({
      userId: userId as string,
      page: req.query.page as string | undefined,
      limit: req.query.limit as string | undefined,
    });

    const result = getNotifications(userId as string, page, limit);

    return res.json({
      success: true,
      data: result.data,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
      },
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// GET /api/notifications/unread-count
// 사용자의 읽지 않은 알림 개수 조회
// 쿼리 파라미터: userId
router.get('/api/notifications/unread-count', (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required',
      });
    }

    const unread = getUnreadCount(userId as string);

    return res.json({
      success: true,
      unread,
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// POST /api/notifications/:id/read
// 특정 알림을 읽음 처리
// 요청 본문: { userId: string }
// 경로 파라미터: id (notificationId)
router.post('/api/notifications/:id/read', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required',
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Notification ID is required',
      });
    }

    const userIdStr = typeof userId === 'string' ? userId : String(userId);
    const idStr = typeof id === 'string' ? id : String(id);
    const notification = markNotificationAsRead(idStr, userIdStr);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    return res.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// POST /api/notifications/price-change
// 상품 가격 변동 알림 발송
// 요청 본문:
// {
//   productId: string;
//   oldPrice: number;
//   newPrice: number;
//   productName?: string;
//   likedUserIds?: string[];
// }
router.post('/api/notifications/price-change', async (req: Request, res: Response) => {
  try {
    const { productId, oldPrice, newPrice, productName, likedUserIds } = req.body;

    if (!productId || oldPrice === undefined || newPrice === undefined) {
      return res.status(400).json({
        success: false,
        message: 'productId, oldPrice, newPrice are required',
      });
    }

    await onProductPriceChange(productId, oldPrice, newPrice, productName, likedUserIds);

    return res.json({
      success: true,
      message: 'Price change notifications sent',
    });
  } catch (error) {
    console.error('Error sending price change notifications:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// POST /api/notifications/new-comment
// 댓글 알림 발송
// 요청 본문:
// {
//   postId: string;
//   commenterId: string;
//   commentText: string;
//   postTitle?: string;
//   commenterName?: string;
// }
router.post('/api/notifications/new-comment', async (req: Request, res: Response) => {
  try {
    const { postId, commenterId, commentText, postTitle, commenterName } = req.body;

    if (!postId || !commenterId || !commentText) {
      return res.status(400).json({
        success: false,
        message: 'postId, commenterId, commentText are required',
      });
    }

    await onNewComment(postId, commenterId, commentText, postTitle, commenterName);

    return res.json({
      success: true,
      message: 'Comment notification sent',
    });
  } catch (error) {
    console.error('Error sending comment notification:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;
