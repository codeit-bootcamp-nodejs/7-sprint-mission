import express from "express";
import {
  createPost,
  deletePost,
  updatePost,
  createPostComment,
  deletePostComment,
  updatePostComment,
  togglePostLike,
} from "../controller/post.controller.js";
import { accessTokenVerify } from "../middleware/jwtVerify.js";

const router = express.Router();

router.post("/create", accessTokenVerify, createPost);
router.delete("/:postId/delete", accessTokenVerify, deletePost);
router.patch("/:postId/update", accessTokenVerify, updatePost);

router.post("/:postId/createComment", accessTokenVerify, createPostComment);
router.delete(
  "/:postId/:commentId/deleteComment",
  accessTokenVerify,
  deletePostComment
);
router.patch(
  "/:postId/:commentId/updateComment",
  accessTokenVerify,
  updatePostComment
);

router.post("/:postId/like", accessTokenVerify, togglePostLike);

export default router;
