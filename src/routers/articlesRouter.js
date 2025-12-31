import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import { authenticate } from '../lib/authenticate.js';
import {
  createArticle,
  getArticleList,
  getArticle,
  updateArticle,
  deleteArticle,
  createComment,
  getCommentList,
  articleLike,
} from '../controllers/articlesController.js';
import { optional } from 'superstruct';

const articlesRouter = express.Router();

articlesRouter.post('/', authenticate(), withAsync(createArticle));
articlesRouter.get('/', withAsync(getArticleList));
articlesRouter.get('/:id', authenticate({optional: true}), withAsync(getArticle));
articlesRouter.patch('/:id', authenticate(), withAsync(updateArticle));
articlesRouter.delete('/:id', authenticate(), withAsync(deleteArticle));
articlesRouter.post('/:id/comments', authenticate(), withAsync(createComment));
articlesRouter.get('/:id/comments', withAsync(getCommentList));
articlesRouter.post('/:id/like', authenticate(), withAsync(articleLike));

export default articlesRouter;
