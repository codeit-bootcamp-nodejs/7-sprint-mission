import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import * as ac from '../controllers/articlesController.js';
import { authMiddleware } from '../lib/authMiddleware.js';

const router = express.Router();

router.get('/', withAsync(ac.getArticleList));

router.use(authMiddleware);

router.get('/:id', withAsync(ac.getArticle));
router.post('/', withAsync(ac.createArticle));
router.post('/:id/like', withAsync(ac.toggleArticleLike));
router.post('/:id/comments', withAsync(ac.createComment));
router.patch('/:id', withAsync(ac.updateArticle));
router.delete('/:id', withAsync(ac.deleteArticle));

export default router;