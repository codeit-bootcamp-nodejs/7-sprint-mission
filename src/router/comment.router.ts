import express from 'express';
import { updateComment, deleteComment } from '../controller/comment.controller';
import { validateComment } from '../middlewares/comment.validationError';
import { validateCommentId } from '../middlewares/id.validationError';
import { authenticateUser } from '../middlewares/auth.middleware';

const commentRouter = express.Router();

// 인증 미들웨어 적용
commentRouter.use(authenticateUser);

// Comment 공통
commentRouter.patch('/comments/:commentId', validateCommentId, validateComment, updateComment);
commentRouter.delete('/comments/:commentId', validateCommentId, deleteComment);

export default commentRouter;
