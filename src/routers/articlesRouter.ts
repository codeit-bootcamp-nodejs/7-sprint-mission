import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import * as articlesController from '../controllers/articlesController';

const router = Router();

router.get('/', articlesController.getArticles);
router.get('/:id', articlesController.getArticle);
router.post('/', authenticate, articlesController.createArticle);
router.patch('/:id', authenticate, articlesController.updateArticle);
router.delete('/:id', authenticate, articlesController.deleteArticle);
router.post('/:id/likes', authenticate, articlesController.likeArticle);
router.delete('/:id/likes', authenticate, articlesController.unlikeArticle);
router.get('/:id/comments', articlesController.getArticleComments);
router.post('/:id/comments', authenticate, articlesController.createArticleComment);

export default router;
