import express from "express";
import * as articleController from "../modules/articles/comments/articleCommentController.js";

const router = express.Router({ mergeParams: true });

router.get("/", articleController.getComments);
router.post("/", articleController.createComment);
router.patch("/:id", articleController.updateComment);
router.delete("/:id", articleController.deleteComment);

export default router;
