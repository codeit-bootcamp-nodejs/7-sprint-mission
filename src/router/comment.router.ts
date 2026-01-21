import express from 'express';
import { updateComment, deleteComment } from '../controller/comment.controller';
import { validateComment } from '../middlewares/comment.validationError';
import { validateCommentId } from '../middlewares/id.validationError';
import { authenticateUser } from '../middlewares/auth.middleware';

const commentRouter = express.Router();

// Comment 공통
commentRouter.patch(
  '/comments/:commentId',
  authenticateUser,
  validateCommentId,
  validateComment,
  updateComment,
);

commentRouter.delete('/comments/:commentId', authenticateUser, validateCommentId, deleteComment);

export default commentRouter;
