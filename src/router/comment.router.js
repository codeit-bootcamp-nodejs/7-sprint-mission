import express from 'express';
import { updateComment, deleteComment } from '../controller/comment.controller.js';
import { validateComment } from '../middlewares/comment.validationError.js';
import { validateCommentId } from '../middlewares/id.validationError.js';
import auth from '../middlewares/auth.middleware.js';

const commentRouter = express.Router();

// Comment 공통
commentRouter.patch(
  '/comments/:commentId',
  auth,
  validateCommentId,
  validateComment,
  updateComment,
);

commentRouter.delete('/comments/:commentId', auth, validateCommentId, deleteComment);

export default commentRouter;
