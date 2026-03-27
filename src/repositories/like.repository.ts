import { prisma } from '../lib/prisma';

export async function findProductLike(userId: number, productId: number) {
  return prisma.productLike.findUnique({ where: { userId_productId: { userId, productId } } });
}

export async function findProductLikesByUser(userId: number, productIds: number[]): Promise<Set<number>> {
  const likes = await prisma.productLike.findMany({
    where: { userId, productId: { in: productIds } },
    select: { productId: true },
  });
  return new Set(likes.map((l) => l.productId));
}

export async function createProductLike(userId: number, productId: number) {
  return prisma.productLike.create({ data: { userId, productId } });
}

export async function deleteProductLike(userId: number, productId: number) {
  return prisma.productLike.delete({ where: { userId_productId: { userId, productId } } });
}

export async function findArticleLike(userId: number, articleId: number) {
  return prisma.articleLike.findUnique({ where: { userId_articleId: { userId, articleId } } });
}

export async function findArticleLikesByUser(userId: number, articleIds: number[]): Promise<Set<number>> {
  const likes = await prisma.articleLike.findMany({
    where: { userId, articleId: { in: articleIds } },
    select: { articleId: true },
  });
  return new Set(likes.map((l) => l.articleId));
}

export async function createArticleLike(userId: number, articleId: number) {
  return prisma.articleLike.create({ data: { userId, articleId } });
}

export async function deleteArticleLike(userId: number, articleId: number) {
  return prisma.articleLike.delete({ where: { userId_articleId: { userId, articleId } } });
}
