import express from "express";
import articleService from "../services/article.service.js";
import CustomError from "../utils/CustomError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { validateArticleInfo } from "../middlewares/validator.js";

const router = express.Router();

router
  .route("/")
  .post(
    validateArticleInfo,
    asyncHandler(async (req, res) => {
      const newArticle = await articleService.createArticle(req.body);
      res.status(201).json({ message: "Success", data: newArticle });
    })
  )
  .get(
    asyncHandler(async (req, res) => {
      const { offset = 0, limit = 10, sort = "recent", search } = req.query;
      const { articles, totalCount } = await articleService.getArticleList({
        offset: Number(offset),
        limit: Number(limit),
        sort,
        search,
      });
      res.status(200).json({
        message: "Success",
        totalCount: totalCount,
        data: articles,
      });
    })
  );

router
  .route("/:id")
  .get(
    asyncHandler(async (req, res) => {
      const article = await articleService.getArticleById(req.params.id);
      if (!article) {
        throw new CustomError("게시글을 찾을 수 없습니다.", 404);
      }
      res.status(200).json({
        message: "Success",
        data: article,
      });
    })
  )
  .patch(
    validateArticleInfo,
    asyncHandler(async (req, res) => {
      const updatedArticle = await articleService.patchArticle(
        req.params.id,
        req.body
      );
      res.status(200).json({ message: "Success", data: updatedArticle });
    })
  )
  .delete(
    asyncHandler(async (req, res) => {
      await articleService.deleteArticle(req.params.id);
      res.status(204).send();
    })
  );

export default router;
