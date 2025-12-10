import express from "express";
import { prisma } from "../prisma/prisma.js";
import { asyncHandler } from "../asyncHandler.js";
import { HTTPError } from "../error.js";
import { buildSearchQuery } from "../utils/search.js";
import { Article } from "../structs/article.js";
import { Comment } from "../structs/comment.js";
import {
  createContinuationToken,
  parseContinuationToken,
  buildCursorWhere,
  orderByToSort,
} from "../utils/cursor-pagination.js";

const router = express.Router();

router
  .route("/")
  .get(
    asyncHandler(async (req, res) => {
      const {
        offset = 0,
        limit = 10,
        sort = "recent",
        search = "",
        keyword = "",
      } = req.query;
      const skip = parseInt(offset, 10);
      const take = parseInt(limit, 10);

      if (isNaN(skip) || isNaN(take) || skip < 0 || take < 1) {
        throw new HTTPError(400, "Offset and limit must be valid numbers");
      }

      const orderBy =
        sort === "recent" ? { created_at: "desc" } : { created_at: "desc" };

      const searchQuery = search || keyword;
      const where = buildSearchQuery(searchQuery, ["title", "content"]);

      const articles = await prisma.article.findMany({
        where,
        skip,
        take,
        orderBy,
      });
      res
        .status(200)
        .json(articles.map((article) => Article.fromEntity(article)));
    })
  )
  .post(
    asyncHandler(async (req, res) => {
      Article.validateCreate(req.body);
      const { title, content } = req.body;

      const newArticle = await prisma.article.create({
        data: { title, content },
      });
      res.status(201).json(Article.fromEntity(newArticle));
    })
  );

router
  .route("/:id")
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      Article.validateId(id);

      const article = await prisma.article.findUnique({
        where: { id },
      });

      if (!article) {
        throw new HTTPError(404, "Article not found");
      }

      res.status(200).json(Article.fromEntity(article));
    })
  )
  .patch(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      Article.validateId(id);
      Article.validateUpdate(req.body);
      const { title, content } = req.body;

      const article = await prisma.article.update({
        where: { id },
        data: { title, content },
      });
      res.status(200).json(Article.fromEntity(article));
    })
  )
  .delete(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      Article.validateId(id);

      const article = await prisma.article.delete({
        where: { id },
      });
      res.status(200).json(Article.fromEntity(article));
    })
  );

router
  .route("/:id/comments")
  .post(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      Article.validateId(id);
      Comment.validateCreate(req.body);
      const { content } = req.body;

      const article = await prisma.article.findUnique({ where: { id } });
      if (!article) {
        throw new HTTPError(404, "Article not found");
      }

      const comment = await prisma.comment.create({
        data: {
          content,
          articleId: id,
        },
      });
      res.status(201).json(Comment.fromEntity(comment));
    })
  )
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      Article.validateId(id);
      const { limit = 10, cursorId } = req.query;

      const take = parseInt(limit, 10);
      if (isNaN(take) || take < 1) {
        throw new HTTPError(400, "Limit must be a positive number");
      }

      const article = await prisma.article.findUnique({ where: { id } });
      if (!article) {
        throw new HTTPError(404, "Article not found");
      }

      const orderBy = [{ created_at: "desc" }, { id: "desc" }];
      const sort = orderByToSort(orderBy);

      const cursorData = parseContinuationToken(cursorId);
      const cursorWhere = buildCursorWhere(cursorData?.data, sort);

      const where = {
        articleId: id,
        ...cursorWhere,
      };

      const comments = await prisma.comment.findMany({
        where,
        take,
        orderBy,
      });

      const lastItem = comments[comments.length - 1];
      const nextCursor = createContinuationToken(lastItem, sort);

      res.status(200).json({
        list: comments.map((comment) => Comment.fromEntity(comment)),
        nextCursor,
      });
    })
  );

export default router;
