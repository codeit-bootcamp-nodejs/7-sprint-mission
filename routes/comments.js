import express from "express";
import * as commentController from "../controllers/comment.controller.js";
import { validateComment } from "../middlewares/validator.js";
const router = express.Router();

router
  .route("/:commentId")
  .patch(validateComment, commentController.updateComment)
  .delete(commentController.deleteComment);
export default router;
