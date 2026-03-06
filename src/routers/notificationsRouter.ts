import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import * as notificationsController from '../controllers/notificationsController';

const router = Router();

router.patch('/:id/read', authenticate, notificationsController.markAsRead);

export default router;
