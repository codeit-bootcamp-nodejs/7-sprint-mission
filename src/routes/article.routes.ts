import { Router } from 'express';
import * as articleController from '../controllers/article.controller';
import * as commentController from '../controllers/comment.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { validateCreateArticle, validateUpdateArticle } from '../validators/article.validator';
import { validateCreateComment } from '../validators/comment.validator';

const router = Router();

router
  .route('/')
  .get(articleController.getArticles)
  .post(authenticate, validate(validateCreateArticle), articleController.createArticle);

router
  .route('/:id')
  .get(articleController.getArticle)
  .patch(authenticate, validate(validateUpdateArticle), articleController.updateArticle)
  .delete(authenticate, articleController.deleteArticle);

router.post('/:id/like', authenticate, articleController.likeArticle);
router.delete('/:id/like', authenticate, articleController.unlikeArticle);

router
  .route('/:id/comments')
  .post(authenticate, validate(validateCreateComment), commentController.createArticleComment)
  .get(commentController.getArticleComments);

export default router;
