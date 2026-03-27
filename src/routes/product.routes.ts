import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import * as commentController from '../controllers/comment.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { validateCreateProduct, validateUpdateProduct } from '../validators/product.validator';
import { validateCreateComment } from '../validators/comment.validator';

const router = Router();

router
  .route('/')
  .get(productController.getProducts)
  .post(authenticate, validate(validateCreateProduct), productController.createProduct);

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(authenticate, validate(validateUpdateProduct), productController.updateProduct)
  .delete(authenticate, productController.deleteProduct);

router.post('/:id/like', authenticate, productController.likeProduct);
router.delete('/:id/like', authenticate, productController.unlikeProduct);

router
  .route('/:id/comments')
  .post(authenticate, validate(validateCreateComment), commentController.createProductComment)
  .get(commentController.getProductComments);

export default router;
