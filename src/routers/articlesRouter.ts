import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import {
  createArticle,
  getArticleList,
  getArticle,
  updateArticle,
  deleteArticle,
  createComment,
  getCommentList,
  likeArticle,
} from '../controllers/articlesController.js';
import { authMiddleware, optionalAuth } from '../middlewares/authMiddleware.js';

const articlesRouter = express.Router();

articlesRouter
  .route('/')
  .post(authMiddleware, withAsync(createArticle))
  .get(withAsync(getArticleList));

articlesRouter
  .route('/:id')
  .get(optionalAuth, withAsync(getArticle))
  .patch(authMiddleware, withAsync(updateArticle))
  .delete(authMiddleware, withAsync(deleteArticle));

articlesRouter
  .route('/:id/comments')
  .post(authMiddleware, withAsync(createComment))
  .get(withAsync(getCommentList));

articlesRouter.post('/:id/like', authMiddleware, withAsync(likeArticle));
export default articlesRouter;
