import express from 'express';
import { ProductController } from '../controller/product.controller';
import { likeProduct } from '../controller/productLike.controller';
import {
  validateProductCreate,
  validationProductUpdate,
} from '../middlewares/product.validationError';
import { createUploader } from '../middlewares/upload';
import { validateProductId } from '../middlewares/id.validationError';
import { authenticateUser, authenticateUserOptional } from '../middlewares/auth.middleware';

const productRouter = express.Router();
const productUpload = createUploader('product');
const productController = new ProductController();

// /:productId 경로로 들어오는 모든 요청은 id 검증로직을 거침
productRouter.use('/:productId', validateProductId);

productRouter.get('/', authenticateUserOptional, productController.getProductList);
productRouter.get('/:productId', authenticateUserOptional, productController.getProductList);
productRouter.get('/:productId/comments', productController.getProductComment);

// 상품 생성, 수정, 삭제, 댓글 등록, 좋아요는 로그인 상태 필수 확인
productRouter.use(authenticateUser);

productRouter.post(
  '/:productId/image',
  productUpload.single('image'),
  productController.uploadProductImage,
);
productRouter.post('/', validateProductCreate, productController.createProduct);
productRouter.patch('/:productId', validationProductUpdate, productController.productUpdate);
productRouter.delete('/:productId', productController.productDelete);

productRouter.post('/:productId/comments', productController.createProductComment);
productRouter.post('/:productId/like', authenticateUser, likeProduct);

export default productRouter;
