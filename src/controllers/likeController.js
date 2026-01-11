import { prismaClient } from "../lib/prismaClient.js";

export async function toggleProductLike(req, res) {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const existingLike = await prismaClient.productLike.findUnique({
      where: {
        userId_productId: {
          userId: Number(userId),
          productId: Number(productId),
        },
      },
    });
    if (existingLike) {
      await prismaClient.productLike.delete({
        where: { id: existingLike.id },
      });
      return res.status(200).json({ isLiked: false, message: "좋아요취소" });
    } else {
      await prismaClient.productLike.create({
        data: {
          userId: Number(userId),
          productId: Number(productId),
        },
      });
      return res.status(201).json({ isLiked: true, message: "좋아요" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
}

export async function toggleArticleLike(req, res) {
  try {
    const userId = req.user.id;
    const { articleId } = req.params;

    const existingLike = await prismaClient.articleLike.findUnique({
      where: {
        userId_articleId: {
          userId: Number(userId),
          articleId: Number(articleId),
        },
      },
    });
    if (existingLike) {
      await prismaClient.articleLike.delete({
        where: { id: existingLike.id },
      });
      return res.status(200).json({ isLiked: false, message: "좋아요취소" });
    } else {
      await prismaClient.articleLike.create({
        data: {
          userId: Number(userId),
          articleId: Number(articleId),
        },
      });
      return res.status(201).json({ isLiked: true, message: "좋아요" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
}

export async function getLikedProducts(req, res) {
  try {
    const userId = Number(req.user.id);

    const likedProducts = await prismaClient.productLike.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });
    const result = likedProducts.map((like) => ({
      ...like.product,
      isLiked: true,
    }));
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "목록 조회 오류" });
  }
}
