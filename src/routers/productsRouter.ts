import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import * as productsController from '../controllers/productsController';

const router = Router();

router.get('/', productsController.getProducts);
router.get('/:id', productsController.getProduct);
router.post('/', authenticate, productsController.createProduct);
router.patch('/:id', authenticate, productsController.updateProduct);
router.delete('/:id', authenticate, productsController.deleteProduct);
router.post('/:id/favorites', authenticate, productsController.favoriteProduct);
router.delete('/:id/favorites', authenticate, productsController.unfavoriteProduct);
router.get('/:id/comments', productsController.getProductComments);
router.post('/:id/comments', authenticate, productsController.createProductComment);

export default router;
