import express from "express";
import {
  toggleProductLike,
  toggleArticleLike,
} from "../controllers/likeController.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getLikedProducts } from "../controllers/likeController.js";

const router = express.Router();

router.post("/products/productId", verifyToken, toggleProductLike);
router.post("/articles/:articleId", verifyToken, toggleArticleLike);
router.get("/products/me", verifyToken, getLikedProducts);

export default router;
