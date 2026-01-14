import express from "express";
import { asyncHandler } from "../middlewares/async-handler.js";
import * as productController from "../controllers/productController.js";
import { auth } from "../middlewares/auth.js";
import { authorizeProductOwner } from "../middlewares/authorize.js";
import { optionalAuth } from "../middlewares/optionalAuth.js";

const router = express.Router();

function validateProduct(req, res, next) {
  const { name, price } = req.body;

  if (!name) return res.status(400).json({ message: "상품명을 입력해 주세요." });
  if (price === undefined) return res.status(400).json({ message: "가격을 입력해 주세요." });

  next();
}

router.post("/", auth, validateProduct, asyncHandler(productController.create));
router.patch("/:id", auth, authorizeProductOwner, asyncHandler(productController.update));
router.delete("/:id", auth, authorizeProductOwner, asyncHandler(productController.remove));
router.post("/:id/comments", auth, asyncHandler(productController.createComment));
router.get("/:id/comments", asyncHandler(productController.listComments));
router.get("/", optionalAuth, asyncHandler(productController.list));
router.get("/:id", optionalAuth, asyncHandler(productController.detail));

export default router;
