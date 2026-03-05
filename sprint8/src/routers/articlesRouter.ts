import express from 'express';
import { withAsync } from '../lib/withAsync';
import {
  createArticle,
  getArticleList,
  getArticle,
  updateArticle,
  deleteArticle,
  createComment,
  getCommentList,
  createLike,
  deleteLike,
} from '../controllers/articlesController';
import authenticate from '../middlewares/authenticate';

const articlesRouter = express.Router();

articlesRouter
  .route('/')
  .post(authenticate(), withAsync(createArticle))
  .get(authenticate({ optional: true }), withAsync(getArticleList));

articlesRouter
  .route('/:id')
  .get(authenticate({ optional: true }), withAsync(getArticle))
  .patch(authenticate(), withAsync(updateArticle))
  .delete(authenticate(), withAsync(deleteArticle));

articlesRouter
  .route('/:id/comments')
  .post(authenticate(), withAsync(createComment))
  .get(withAsync(getCommentList));

articlesRouter
  .route('/:id/likes')
  .post(authenticate(), withAsync(createLike))
  .delete(authenticate(), withAsync(deleteLike));

export default articlesRouter;
