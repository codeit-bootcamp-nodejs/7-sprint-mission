import express from "express";
import * as productController from "../controllers/product.controller.js";
import * as commentController from "../controllers/comment.controller.js";
import {
  validateProductInfo,
  validateComment,
} from "../middlewares/validator.js";
const router = express.Router();

router
  .route("/")
  .get(productController.getProducts)
  .post(validateProductInfo, productController.createProduct);

router
  .route("/:id")
  .get(productController.getProductById)
  .patch(validateProductInfo, productController.updateProduct)
  .delete(productController.deleteProduct);

// 댓글 관련 라우트 (여기서 에러가 났었습니다)
router.post(
  "/:id/comments",
  validateComment,
  commentController.createProductComment
);
router.get("/:id/comments", commentController.getProductComments);

export default router;
