import express from 'express';
import {
  productGet,
  productFindGet,
  productCreate,
  productUpdate,
  productDelete,
  createProductComment,
  getProductComment,
  uploadProductImage,
} from '../controller/product.controller.js';
import { likeProduct, unLikeProduct } from '../controller/productLike.controller.js';
import {
  validateProductCreate,
  validationProductUpdate,
} from '../middlewares/product.validationError.js';
import { createUploader } from '../middlewares/upload.js';
import { validateProductId } from '../middlewares/id.validationError.js';
import auth from '../middlewares/auth.middleware.js';

const productRouter = express.Router();
const productUpload = createUploader('product');

productRouter.post('/:productId/image', auth, productUpload.single('image'), uploadProductImage);
productRouter.get('/', productGet);
productRouter.get('/:productId', validateProductId, productFindGet);
productRouter.post('/', auth, validateProductCreate, productCreate);
productRouter.patch('/:productId', auth, validateProductId, validationProductUpdate, productUpdate);
productRouter.delete('/:productId', auth, validateProductId, productDelete);
productRouter.post('/:productId/comments', auth, validateProductId, createProductComment);
productRouter.get('/:productId/comments', validateProductId, getProductComment);
productRouter.post('/:productId/like', auth, validateProductId, likeProduct);
productRouter.delete('/:productId/like', auth, validateProductId, unLikeProduct);

export default productRouter;
