import express from "express";
import { asyncHandler } from "../middlewares/async-handler.js";
import { auth } from "../middlewares/auth.js";
import * as userController from "../controllers/userController.js";

const router = express.Router();

router.get("/user", auth, asyncHandler(userController.user));
router.patch("/user", auth, asyncHandler(userController.updateUser));
router.patch("/user/password", auth, asyncHandler(userController.changeUserPassword));
router.get("/user/products", auth, asyncHandler(userController.userProducts));
router.get("/user/liked-products", auth, asyncHandler(userController.likedProducts));
router.get("/user/liked-articles", auth, asyncHandler(userController.likedArticles));

export default router;
