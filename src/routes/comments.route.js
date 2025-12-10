import express from "express";
import commentService from "../services/comment.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { validateCommentInfo } from "../middlewares/validator.js";

const router = express.Router();

router
  .route("/products/:id")
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const limit = parseInt(req.query.limit || 10);
      const token = req.query.token;
      const result = await commentService.getProductComments(id, limit, token);
      res.status(200).json({
        message: "Success",
        data: result.comments,
        nextToken: result.nextToken || null,
      });
    })
  )
  .post(
    validateCommentInfo,
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const { content } = req.body;
      const comment = await commentService.createProductComment(id, content);
      res.status(201).json({ message: "Success", data: comment });
    })
  );

router
  .route("/articles/:id")
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const limit = parseInt(req.query.limit || 10);
      const token = req.query.token;
      const result = await commentService.getArticleComments(id, limit, token);
      res.status(200).json({
        message: "Success",
        data: result.comments,
        nextToken: result.nextToken || null,
      });
    })
  )
  .post(
    validateCommentInfo,
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const { content } = req.body;
      const comment = await commentService.createArticleComment(id, content);
      res.status(201).json({ message: "Success", data: comment });
    })
  );

router
  .route("/:id")
  .patch(
    validateCommentInfo,
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const { content } = req.body;
      const patchedComment = await commentService.patchComment(id, content);
      res.status(200).json({ message: "Success", data: patchedComment });
    })
  )
  .delete(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      await commentService.deleteComment(id);
      res.status(204).send();
    })
  );

export default router;
