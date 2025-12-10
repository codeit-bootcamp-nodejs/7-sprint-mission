import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../services/productService.js";
import { validateProductInfo } from "../middlewares/validator.js";
import productCommentRouter from "./product-comment.route.js";
import productImageRouter from "./product.image.js";

const productRouter = express.Router();

productRouter.use("/:productId/image", productImageRouter);
productRouter.use("/:productId/comments", productCommentRouter);

productRouter
  .route("/")
  .get(getProducts) // 상품 목록 조회
  .post(validateProductInfo, createProduct); // 상품 등록

productRouter
  .route("/:id")
  .get(getProductById) // 상품 목록 상세 조회
  .patch(validateProductInfo, updateProduct) // 상품 수정
  .delete(deleteProduct); // 상품 삭제

export default productRouter;
