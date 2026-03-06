import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import * as usersController from '../controllers/usersController';

const router = Router();

router.use(authenticate);

router.get('/me', usersController.getMe);
router.patch('/me', usersController.updateMe);
router.patch('/me/password', usersController.updatePassword);
router.get('/me/products', usersController.getMyProducts);
router.get('/me/favorites', usersController.getMyFavorites);
router.get('/me/notifications', usersController.getMyNotifications);
router.get('/me/notifications/unread-count', usersController.getMyUnreadCount);

export default router;
