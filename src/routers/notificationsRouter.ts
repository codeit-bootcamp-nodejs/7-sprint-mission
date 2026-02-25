import express from 'express';
import { withAsync } from '../lib/withAsync';
import { authenticate } from '../lib/authenticate';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
} from '../controllers/notificationsController';

const router = express.Router();

router.use(authenticate());

router.get('/', withAsync(getNotifications));
router.get('/unread-count', withAsync(getUnreadCount));
router.patch('/:id/read', withAsync(markAsRead));

export default router;