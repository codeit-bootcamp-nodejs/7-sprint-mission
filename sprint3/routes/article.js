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

articleRouter
  .route("/")
  .get(getAllArticles) //게시글 목록 조회
  .post(validateArticleInfo, creatArticles); //게시글 등록

articleRouter
  .route("/:id")
  .get(getArticleById) //게시글 목록 상세 조회
  .patch(validateArticleInfo, updateArticle) //게시글 수정
  .delete(deleteArticle); //게시글 삭제

export default articleRouter;
