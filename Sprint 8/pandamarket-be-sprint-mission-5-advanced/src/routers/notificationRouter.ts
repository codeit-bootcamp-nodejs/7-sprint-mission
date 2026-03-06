import express from 'express';
import * as notificationsController from '../controllers/notificationController';
import authenticate from '../middlewares/authenticate';

const router = express.Router();

router.use(authenticate());

router.get('/', notificationsController.getMyNotifications);
router.get('/unread-count', notificationsController.getUnreadCount);
router.patch('/:id/read', notificationsController.readNotification);

export default router;
