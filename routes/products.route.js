import express from "express";
import { prisma } from "../prisma/prisma.js";
import { asyncHandler } from "../asyncHandler.js";
import { HTTPError } from "../error.js";
import { buildSearchQuery } from "../utils/search.js";
import { Product } from "../structs/product.js";
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
      const where = buildSearchQuery(searchQuery, ["name", "description"]);

      const products = await prisma.product.findMany({
        where,
        skip,
        take,
        orderBy,
      });
      res
        .status(200)
        .json(products.map((product) => Product.fromEntity(product)));
    })
  )
  .post(
    asyncHandler(async (req, res) => {
      Product.validateCreate(req.body);
      const { name, description, price, tags } = req.body;

      const newProduct = await prisma.product.create({
        data: { name, description, price, tags },
      });

      res.status(201).json(Product.fromEntity(newProduct));
    })
  );

router
  .route("/:id")
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      Product.validateId(id);

      const product = await prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        throw new HTTPError(404, "Product not found");
      }

      res.status(200).json(Product.fromEntity(product));
    })
  )
  .patch(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      Product.validateId(id);
      Product.validateUpdate(req.body);
      const { name, description, price, tags } = req.body;

      const product = await prisma.product.update({
        where: { id },
        data: { name, description, price, tags },
      });
      res.status(200).json(Product.fromEntity(product));
    })
  )
  .delete(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      Product.validateId(id);

      const product = await prisma.product.delete({
        where: { id },
      });
      res.status(200).json(Product.fromEntity(product));
    })
  );

router
  .route("/:id/comments")
  .post(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      Product.validateId(id);
      Comment.validateCreate(req.body);
      const { content } = req.body;

      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) {
        throw new HTTPError(404, "Product not found");
      }

      const comment = await prisma.comment.create({
        data: {
          content,
          productId: id,
        },
      });

      res.status(201).json(Comment.fromEntity(comment));
    })
  )
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      Product.validateId(id);
      const { limit = 10, cursorId } = req.query;

      const take = parseInt(limit, 10);
      if (isNaN(take) || take < 1) {
        throw new HTTPError(400, "Limit must be a positive number");
      }

      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) {
        throw new HTTPError(404, "Product not found");
      }

      const orderBy = [{ created_at: "desc" }, { id: "desc" }];
      const sort = orderByToSort(orderBy);

      const cursorData = parseContinuationToken(cursorId);
      const cursorWhere = buildCursorWhere(cursorData?.data, sort);

      const where = {
        productId: id,
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
