import express from 'express';
import { withAsync } from '../lib/withAsync';
import { authenticate } from '../lib/authenticate';
import { updateComment, deleteComment } from '../controllers/commentsController';

const commentsRouter = express.Router();

commentsRouter.patch('/:id', authenticate(), withAsync(updateComment));
commentsRouter.delete('/:id', authenticate(), withAsync(deleteComment));

export default commentsRouter;
