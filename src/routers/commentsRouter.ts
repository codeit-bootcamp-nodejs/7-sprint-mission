import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import { updateComment, deleteComment } from '../controllers/commentsController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const commentsRouter = express.Router();

commentsRouter
  .route('/:id')
  .patch(authMiddleware, withAsync(updateComment))
  .delete(authMiddleware, withAsync(deleteComment));

export default commentsRouter;
