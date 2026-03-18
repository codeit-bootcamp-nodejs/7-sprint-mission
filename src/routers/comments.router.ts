import express from "express";
import { withAsync } from "../lib/withAsync.js";
import { authenticate } from "../ middlewares/authenticate.js";
import {
  updateComment,
  deleteComment,
} from "../controllers/comments.controller.js";

const commentsRouter = express.Router();

commentsRouter.patch("/:id", authenticate(), withAsync(updateComment));
commentsRouter.delete("/:id", authenticate(), withAsync(deleteComment));

export default commentsRouter;
