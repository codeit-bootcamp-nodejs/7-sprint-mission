import express from "express";
import * as articleController from "../modules/articles/articleController.js";
import articleCommentRouter from "./articleComment.js";
import { validateArticleCreate } from "../middlewares/validateArticleCreate.js";

const router = express.Router();

router.get("/", articleController.getArticles);
router.post("/", validateArticleCreate, articleController.createArticle);
router.delete("/:id", articleController.deleteArticle);
router.patch("/:id", articleController.updateArticle);

router.use("/:articleId/comments", articleCommentRouter);

export default router;
