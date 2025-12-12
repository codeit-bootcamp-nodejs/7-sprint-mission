import express from "express";
import * as productCommentController from "../modules/products/comments/productCommentController.js";

const router = express.Router({ mergeParams: true });

router.get("/", productCommentController.getComments);
router.post("/", productCommentController.createComment);
router.patch("/:id", productCommentController.updateComment);
router.delete("/:id", productCommentController.deleteComment);

export default router;
