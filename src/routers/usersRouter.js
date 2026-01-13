import express from "express";
import {
  getMe,
  updateMe,
  updatePassword,
  getMyProducts,
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", verifyToken, getMe);
router.get("/me/products", verifyToken, getMyProducts);
router.patch("/me", verifyToken, updateMe);
router.patch("/me/password", verifyToken, updatePassword);

export default router;
