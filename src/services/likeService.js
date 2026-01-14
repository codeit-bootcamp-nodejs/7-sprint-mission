import { prisma } from "../../prisma/prisma.js";

// 좋아요 (상품)
export const likeProduct = async ({ userId, productId }) => {
  try {
    await prisma.productLike.create({
      data: { user_id: userId, product_id: productId },
    });
  } catch (err) {
    if (err?.code === "P2002") return;
    if (err?.code === "P2003") return;
    throw err;
  }
};

// 좋아요 취소 (상품)
export const unlikeProduct = async ({ userId, productId }) => {
  await prisma.productLike.deleteMany({
    where: { user_id: userId, product_id: productId },
  });
};

// 좋아요 (게시글)
export const likeArticle = async ({ userId, articleId }) => {
  try {
    await prisma.articleLike.create({
      data: { user_id: userId, article_id: articleId },
    });
  } catch (err) {
    if (err?.code === "P2002") return;
    if (err?.code === "P2003") return;
    throw err;
  }
};

// 좋아요 취소 (게시글)
export const unlikeArticle = async ({ userId, articleId }) => {
  await prisma.articleLike.deleteMany({
    where: { user_id: userId, article_id: articleId },
  });
};
