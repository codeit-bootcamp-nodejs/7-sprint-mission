import { Router } from 'express';
import * as commentController from '../controllers/comment.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { validateUpdateComment } from '../validators/comment.validator';

const router = Router();

router
  .route('/:id')
  .patch(authenticate, validate(validateUpdateComment), commentController.updateComment)
  .delete(authenticate, commentController.deleteComment);

export default router;
