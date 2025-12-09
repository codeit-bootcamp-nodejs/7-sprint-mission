import express from 'express';
import * as articleController from '../controllers/article.controller.js';
import * as commentController from '../controllers/comment.controller.js';
import { validateArticleInfo, validateComment } from '../middlewares/validator.js';
const router = express.Router();

router.route('/')
  .get(articleController.getArticles)
  .post(validateArticleInfo, articleController.createArticle);

router.route('/:id')
  .get(articleController.getArticleById)
  .patch(validateArticleInfo, articleController.updateArticle)
  .delete(articleController.deleteArticle);

// 댓글 관련 라우트
router.post('/:id/comments', validateComment, commentController.createArticleComment);
router.get('/:id/comments', commentController.getArticleComments);

export default router;
