import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import { updateComment, deleteComment } from '../controllers/commentsController.js';
import { authMiddleware } from '../lib/authMiddleware.js';

const commentsRouter = express.Router();

commentsRouter.patch('/:id', authMiddleware, withAsync(updateComment));
commentsRouter.delete('/:id', authMiddleware, withAsync(deleteComment));

export default commentsRouter;