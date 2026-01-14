import express from "express";
import { asyncHandler } from "../middlewares/async-handler.js";
import { auth } from "../middlewares/auth.js";
import * as likeController from "../controllers/likeController.js";

const router = express.Router();

// 좋아요 (상품)
router.post("/products/:id/like", auth, asyncHandler(likeController.likeProduct));
router.delete("/products/:id/like", auth, asyncHandler(likeController.unlikeProduct));

// 좋아요 (게시글)
router.post("/articles/:id/like", auth, asyncHandler(likeController.likeArticle));
router.delete("/articles/:id/like", auth, asyncHandler(likeController.unlikeArticle));

export default router;
