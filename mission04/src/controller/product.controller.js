import prisma from "../../prisma/prisma.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createProduct = asyncHandler(async (req, res) => {
  const { name, price } = req.body;

  const product = await prisma.product.create({
    data: {
      name,
      price,
      user_id: Number(req.user.id),
    },
  });

  res.status(201).json({ message: "제품 추가 성공" });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const productId = BigInt(req.params.productId);
  const userId = BigInt(req.user.id);

  const product = await prisma.product.delete({
    where: {
      id: productId,
      user_id: userId,
    },
  });

  res.status(201).json({ message: "제품 삭제 성공" });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const productId = BigInt(req.params.productId);
  const userId = BigInt(req.user.id);
  const { name, price } = req.body;

  const product = await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      name,
      price,
    },
  });

  if (!product) {
    res.status(404).json({ message: "상품 없음" });
  }
  if (product.user_id !== userId) {
    res.status(403).json({ message: "권한 없음" });
  }

  res.status(201).json({ message: "제품 수정 성공" });
});

export const likeProduct = asyncHandler(async (req, res) => {
  const productId = BigInt(req.params.productId);

  const product = await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      like: {
        increment: 1,
      },
    },
    select: {
      like: true,
    },
  });

  res.status(201).json({ message: "like +1" });
});

export const createProductComment = asyncHandler(async (req, res) => {
  const userId = BigInt(req.user.id);
  const productId = BigInt(req.params.productId);
  const { contents } = req.body;

  const productComment = await prisma.comment.create({
    data: {
      contents,
      user_id: userId,
      product_id: productId,
    },
  });

  res.status(201).json({ message: "product comment ok" });
});

export const deleteProductComment = asyncHandler(async (req, res) => {
  const userId = BigInt(req.user.id);
  const productId = BigInt(req.params.productId);
  const commentId = BigInt(req.params.commentId);

  try {
    const productComment = await prisma.comment.delete({
      where: {
        user_id: userId,
        product_id: productId,
        id: commentId,
      },
    });
  } catch (e) {
    if (e.code === "P2025") {
      res.status(404).json({ message: "not exists productComment" });
    } else {
      throw e;
    }
  }

  res.status(201).json({ message: "delete comment ok" });
});

export const updateProductComment = asyncHandler(async (req, res) => {
  const userId = BigInt(req.user.id);
  const productId = BigInt(req.params.productId);
  const commentId = BigInt(req.params.commentId);
  const { contents } = req.body;

  try {
    const productComment = await prisma.comment.update({
      where: {
        user_id: userId,
        product_id: productId,
        id: commentId,
      },
      data: {
        contents,
      },
    });
  } catch (e) {
    if (e.code === "P2025") {
      res.status(404).json({ message: "not exists productComment" });
    } else {
      throw e;
    }
  }

  res.status(201).json({ message: "update comment ok" });
});

export const toggleProductLike = asyncHandler(async (req, res) => {
  const userId = BigInt(req.user.id);
  const productId = BigInt(req.params.productId);

  const existingLike = await prisma.productLike.findUnique({
    where: {
      user_id_product_id: {
        user_id: userId,
        product_id: productId,
      },
    },
  });

  let likeCount;

  if (existingLike) {
    [, { like_count: likeCount }] = await prisma.$transaction([
      prisma.productLike.delete({
        where: { id: existingLike.id },
      }),
      prisma.product.update({
        where: { id: productId },
        data: { like_count: { decrement: 1 } },
        select: { like_count: true },
      }),
    ]);
  } else {
    [, { like_count: likeCount }] = await prisma.$transaction([
      prisma.productLike.create({
        data: {
          user_id: userId,
          product_id: productId,
        },
      }),
      prisma.product.update({
        where: { id: productId },
        data: { like_count: { increment: 1 } },
        select: { like_count: true },
      }),
    ]);
  }

  res.json({ isLiked: !existingLike, likeCount: likeCount });
});
