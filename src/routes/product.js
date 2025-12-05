import express from "express";
import { prisma } from "../../prisma/prisma.js";
import {
  validateProductInfo,
  validateBigIntId,
  validateProductUpdateInfo,
  validateProductCommentInfo,
} from "../middlewares/validator.js";
import {
  createProductComment,
  getProductList,
} from "../services/productService.js";
import { ProductComment } from "./comment.js";
import productImageRouter from "./productImage.js";

const router = express.Router();

class Product {
  constructor(id, name, description, price, tags, createdAt) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.createdAt = createdAt;
  }

  static fromEntity(entity) {
    return new Product(
      entity.id.toString(),
      entity.name,
      entity.description,
      entity.price,
      entity.tags,
      entity.created_at
    );
  }
}

// POST
router.post("/", validateProductInfo, async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body;

    const newEntity = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: price,
        tags: tags,
      },
    });

    const product = Product.fromEntity(newEntity);

    res.status(201).json(product);
  } catch (e) {
    console.error("상품 생성 중 오류:", e);
    next(e);
  }
});

// GET
router.get("/", async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const keyword = req.query.keyword;

    const { products, totalCount } = await getProductList(
      limit,
      offset,
      keyword
    );

    res.json({
      products: products,
      totalCount: totalCount,
    });
  } catch (e) {
    console.error("상품 목록 조회 중 오류:", e);
    next(e);
  }
});

// GET 상세
router.get("/:id", validateBigIntId, async (req, res, next) => {
  try {
    const productId = req.params.id;
    const entity = await prisma.product.findUnique({
      where: { id: BigInt(productId) },
    });

    if (!entity) {
      return res.status(404).json({
        message: `ID ${productId}를 가진 상품을 찾을 수 없습니다.`,
      });
    }

    const product = Product.fromEntity(entity);
    res.json(product);
  } catch (e) {
    console.error("상품 상세 조회 중 오류:", e);
    next(e);
  }
});

// PATCH
router.patch(
  "/:id",
  validateBigIntId,
  validateProductUpdateInfo,
  async (req, res, next) => {
    const productId = req.params.id;

    try {
      const { name, description, price, tags } = req.body;

      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (price !== undefined) updateData.price = price;
      if (tags !== undefined) updateData.tags = tags;

      const updatedEntity = await prisma.product.update({
        where: { id: BigInt(productId) },
        data: updateData,
      });

      const product = Product.fromEntity(updatedEntity);
      res.json(product);
    } catch (e) {
      console.error("상품 수정 중 오류:", e);

      if (e.code === "P2025") {
        return res.status(404).json({
          message: `ID ${productId}를 가진 상품을 찾을 수 없습니다.`,
        });
      }
      next(e);
    }
  }
);

// DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    const productId = req.params.id;

    await prisma.product.delete({
      where: { id: BigInt(productId) },
    });

    res.status(204).send();
  } catch (e) {
    console.error("상품 삭제 중 오류:", e);
    next(e);
  }
});

// comment POST
router.post(
  "/:id/comments",
  validateBigIntId,
  validateProductCommentInfo,
  async (req, res, next) => {
    const productId = req.params.id;
    const { content } = req.body;

    try {
      const newEntity = await createProductComment(productId, content);

      const productComment = ProductComment.fromEntity(newEntity);
      res.status(201).json(productComment);
    } catch (e) {
      console.error("게시글 댓글 등록 중 오류:", e);
      next(e);
    }
  }
);

// comment PATCH
router.patch(
  "/:id/comments/:commentId",
  validateBigIntId,
  validateProductCommentInfo,
  async (req, res, next) => {
    const productId = req.params.id;
    const commentId = req.params.commentId;
    const { content } = req.body;

    try {
      // 댓글 ID와 부모 ID를 조건으로 업데이트
      const updatedEntity = await prisma.product_comment.update({
        where: { id: BigInt(commentId), product_id: BigInt(productId) },
        data: { content },
      });

      const productComment = ProductComment.fromEntity(updatedEntity);
      res.status(200).json(productComment); // 200 OK
    } catch (e) {
      console.error(`댓글 ID ${commentId} 수정 중 오류:`, e);
      next(e);
    }
  }
);

// comment DELETE
router.delete(
  "/:id/comments/:commentId",
  validateBigIntId,
  async (req, res, next) => {
    const productId = req.params.id;
    const commentId = req.params.commentId;

    try {
      await prisma.product_comment.delete({
        where: {
          id: BigInt(commentId),
          product_id: BigInt(productId),
        },
      });
      res.status(204).send();
    } catch (e) {
      console.error(`댓글 ID ${commentId} 삭제 중 오류:`, e);
      next(e);
    }
  }
);

router.use("/:productId/image", productImageRouter);

export default router;
