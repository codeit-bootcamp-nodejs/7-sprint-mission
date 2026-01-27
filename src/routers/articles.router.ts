import express from "express";
import { withAsync } from "../lib/withAsync.js";
import {
  createArticle,
  getArticleList,
  getArticle,
  updateArticle,
  deleteArticle,
  createArticleComment,
  getCommentList,
  likeArticle,
  unlikeArticle,
} from "../controllers/articles.controller.js";
import { authenticate } from "../ middlewares/authenticate.js";
const articlesRouter = express.Router();

articlesRouter.post("/", authenticate(), withAsync(createArticle));
articlesRouter.get("/:id", withAsync(getArticle));
articlesRouter.patch("/:id", authenticate(), withAsync(updateArticle));
articlesRouter.delete("/:id", authenticate(), withAsync(deleteArticle));
articlesRouter.get("/", withAsync(getArticleList));
articlesRouter.post(
  "/:id/comments",
  authenticate(),
  withAsync(createArticleComment)
);
articlesRouter.get("/:id/comments", withAsync(getCommentList));
articlesRouter.post("/:id/like", authenticate(), withAsync(likeArticle));
articlesRouter.delete("/:id/like", authenticate(), withAsync(unlikeArticle));

export default articlesRouter;
