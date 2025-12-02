import express from "express";
import { prisma } from "../prisma/prisma.js";
import { asyncHandler } from "../asyncHandler.js";
import { HTTPError } from "../error.js";
import { buildSearchQuery } from "../utils/search.js";
import { Product } from "../structs/product.js";
import { Comment } from "../structs/comment.js";

const router = express.Router();

// 상품 목록 조회
router.get(
  "/",
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
);

// 상품 등록
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, description, price, tags } = req.body;

    // 1차: 입력값 검증 (기존 미들웨어/핸들러 방식)
    if (!name || typeof name !== "string") {
      throw new HTTPError(400, "Name is required and must be a string");
    }

    if (description && typeof description !== "string") {
      throw new HTTPError(400, "Description must be a string");
    }

    if (price === undefined || typeof price !== "number" || price < 0) {
      throw new HTTPError(
        400,
        "Price is required and must be a non-negative number"
      );
    }

    if (
      tags &&
      (!Array.isArray(tags) || !tags.every((tag) => typeof tag === "string"))
    ) {
      throw new HTTPError(400, "Tags must be an array of strings");
    }

    const newProduct = await prisma.product.create({
      data: { name, description, price, tags },
    });

    // 2차: 응답 시 fromEntity에서 다시 검증
    res.status(201).json(Product.fromEntity(newProduct));
  })
);

// 상품 상세 조회
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
      throw new HTTPError(400, "ID must be a number");
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new HTTPError(404, "Product not found");
    }

    res.status(200).json(Product.fromEntity(product));
  })
);

// 상품 수정
router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, price, tags } = req.body;

    if (isNaN(id)) {
      throw new HTTPError(400, "ID must be a number");
    }

    // 1차: 입력값 검증
    if (name !== undefined && typeof name !== "string") {
      throw new HTTPError(400, "Name must be a string");
    }
    if (description !== undefined && typeof description !== "string") {
      throw new HTTPError(400, "Description must be a string");
    }
    if (price !== undefined && (typeof price !== "number" || price < 0)) {
      throw new HTTPError(400, "Price must be a non-negative number");
    }
    if (
      tags !== undefined &&
      (!Array.isArray(tags) || !tags.every((tag) => typeof tag === "string"))
    ) {
      throw new HTTPError(400, "Tags must be an array of strings");
    }

    const product = await prisma.product.update({
      where: { id },
      data: { name, description, price, tags },
    });
    res.status(200).json(Product.fromEntity(product));
  })
);

// 상품 삭제
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
      throw new HTTPError(400, "ID must be a number");
    }

    const product = await prisma.product.delete({
      where: { id },
    });
    res.status(200).json(Product.fromEntity(product));
  })
);

// 상품 댓글 등록
router.post(
  "/:id/comments",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    if (isNaN(id)) {
      throw new HTTPError(400, "ID must be a number");
    }

    // 1차 검증
    if (!content || typeof content !== "string") {
      throw new HTTPError(400, "Content is required and must be a string");
    }

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

    // 2차 검증 (fromEntity)
    res.status(201).json(Comment.fromEntity(comment));
  })
);

export default router;
