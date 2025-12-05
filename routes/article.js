import express from "express";
import { validateArticleInfo } from "../middlewares/validator.js";
import {
  creatArticles,
  deleteArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
} from "../services/articleService.js";
import articleCommentRouter from "./article-comment.route.js";

const articleRouter = express.Router();
articleRouter.use("/:articleId/comments", articleCommentRouter);

//게시글 목록 전체 조회
articleRouter.get("/", getAllArticles);
//게시글 등록
articleRouter.post("/", validateArticleInfo, creatArticles);
//게시글 목록 상세 조회
articleRouter.get("/:id", getArticleById);
//게시글 수정
articleRouter.patch("/:id", validateArticleInfo, updateArticle);
//게시글 삭제
articleRouter.delete("/:id", deleteArticle);

export default articleRouter;
