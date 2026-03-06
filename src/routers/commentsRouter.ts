import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import * as commentsController from '../controllers/commentsController';

const router = Router();

router.patch('/:id', authenticate, commentsController.updateComment);
router.delete('/:id', authenticate, commentsController.deleteComment);

export default router;
