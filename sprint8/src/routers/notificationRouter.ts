// src/routers/notificationRouter.ts 예시
import { Router } from 'express';
import { notificationController } from '../controllers/notificationController';
import authenticate from '../middlewares/authenticate';
import { withAsync } from '../lib/withAsync';

const notificationRouter = Router();

notificationRouter.use(authenticate());

notificationRouter.get('/', withAsync(notificationController.getNotifications));
notificationRouter.get('/unread-count', withAsync(notificationController.getUnreadCount));
notificationRouter.patch('/:id/read', withAsync(notificationController.markAsRead));

export default notificationRouter;