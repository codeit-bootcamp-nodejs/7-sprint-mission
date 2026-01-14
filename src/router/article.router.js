import express from 'express';
import {
  articleGet,
  articleFindGet,
  articleCreate,
  articleUpdate,
  articleDelete,
  createArticleComment,
  getArticleComments,
  uploadArticleImage,
} from '../controller/article.controller.js';
import { likeArticle, unLikeArticle } from '../controller/articleLike.controller.js';
import {
  validationArticleCreate,
  validationArticleUpdate,
} from '../middlewares/article.validationError.js';
import { validateComment } from '../middlewares/comment.validationError.js';
import { validateArticleId } from '../middlewares/id.validationError.js';
import { createUploader } from '../middlewares/upload.js';
import auth from '../middlewares/auth.middleware.js';

const articleRouter = express.Router();
const articleUpload = createUploader('article');

articleRouter.post(
  '/:articleId/image',
  auth,
  validateArticleId,
  articleUpload.single('image'),
  uploadArticleImage,
);
articleRouter.get('/', articleGet);
articleRouter.get('/:articleId', validateArticleId, articleFindGet);
articleRouter.post('/', auth, validationArticleCreate, articleCreate);
articleRouter.patch('/:articleId', auth, validateArticleId, validationArticleUpdate, articleUpdate);
articleRouter.delete('/:articleId', auth, validateArticleId, articleDelete);
articleRouter.post(
  '/:articleId/comments',
  auth,
  validateArticleId,
  validateComment,
  createArticleComment,
);
articleRouter.get('/:articleId/comments', validateArticleId, getArticleComments);
articleRouter.post('/:articleId/like', auth, validateArticleId, likeArticle);
articleRouter.delete('/:articleId/like', auth, validateArticleId, unLikeArticle);

export default articleRouter;
