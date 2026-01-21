import express from "express";
import { asyncHandler } from "../middlewares/async-handler.js";
import * as productController from "../controllers/productController.js";
import { auth } from "../middlewares/auth.js";
import { authorizeProductOwner } from "../middlewares/authorize.js";
import { optionalAuth } from "../middlewares/optionalAuth.js";

const router = express.Router();

router.post("/", auth, asyncHandler(productController.create));
router.get("/", optionalAuth, asyncHandler(productController.list));

router.get("/:id", optionalAuth, asyncHandler(productController.detail));
router.patch("/:id", auth, authorizeProductOwner, asyncHandler(productController.update));
router.delete("/:id", auth, authorizeProductOwner, asyncHandler(productController.remove));

router.post("/:id/comments", auth, asyncHandler(productController.createComment));
router.get("/:id/comments", asyncHandler(productController.listComments));

export default router;
