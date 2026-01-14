import express from "express";
import { asyncHandler } from "../middlewares/async-handler.js";
import * as commentController from "../controllers/commentController.js";
import { auth } from "../middlewares/auth.js";
import { authorizeCommentOwner } from "../middlewares/authorize.js";

const router = express.Router();

router.patch("/:id", auth, authorizeCommentOwner, asyncHandler(commentController.update));
router.delete("/:id", auth, authorizeCommentOwner, asyncHandler(commentController.remove));

export default router;
