import { Router } from 'express';
import * as notificationController from '../controllers/notificationController.js';
import { auth } from '../middlewares/auth.js';

const notificationRouter = Router();

// 내 알림 목록
notificationRouter.get('/', auth, notificationController.getNotifications);

// 안 읽은 알림 개수
notificationRouter.get(
  '/unread-count',
  auth,
  notificationController.getUnreadCount,
);

// 알림 읽음 처리
notificationRouter.patch(
  '/:notificationId/read',
  auth,
  notificationController.markAsRead,
);

export default notificationRouter;