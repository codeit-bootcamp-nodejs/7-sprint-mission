import express from 'express';
import { authenticateUser } from '../middlewares/auth.middleware';
import { NotificationController } from '../controller/notification.controller';

const notificationRouter = express.Router();
const notificationController = new NotificationController();

notificationRouter.use(authenticateUser);

notificationRouter.get('/', notificationController.getNotifications);
notificationRouter.get('/unread', notificationController.getUnreadCount);
notificationRouter.patch('/:notificationId/read', notificationController.markAsRead);

export default notificationRouter;
