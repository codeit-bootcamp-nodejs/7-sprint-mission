import express from "express";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  createProductComment,
  deleteProductComment,
  updateProductComment,
  toggleProductLike,
} from "../controller/product.controller.js";
import { accessTokenVerify } from "../middleware/jwtVerify.js";

const router = express.Router();

router.post("/create", accessTokenVerify, createProduct);
router.delete("/:productId/delete", accessTokenVerify, deleteProduct);
router.patch("/:productId/update", accessTokenVerify, updateProduct);

router.post(
  "/:productId/createComment",
  accessTokenVerify,
  createProductComment
);
router.delete(
  "/:productId/:commentId/deleteComment",
  accessTokenVerify,
  deleteProductComment
);
router.patch(
  "/:productId/:commentId/updateComment",
  accessTokenVerify,
  updateProductComment
);

router.post("/:productId/like", accessTokenVerify, toggleProductLike);

export default router;
