import prisma from '../lib/prismaClient';
import { Prisma } from '@prisma/client';

const productInclude = {
  user: true,
  _count: { select: { favorites: true, comments: true } },
} satisfies Prisma.ProductInclude;

export async function findProducts(params: {
  orderBy: 'recent' | 'favorite';
  page: number;
  pageSize: number;
  keyword?: string;
}) {
  const { orderBy, page, pageSize, keyword } = params;
  const where: Prisma.ProductWhereInput = keyword
    ? {
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } },
        ],
      }
    : {};

  const order: Prisma.ProductOrderByWithRelationInput =
    orderBy === 'favorite'
      ? { favorites: { _count: 'desc' } }
      : { createdAt: 'desc' };

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: order,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: productInclude,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, totalCount };
}

export async function findProductById(id: number) {
  return prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });
}

export async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  userId: number;
}) {
  return prisma.product.create({ data, include: productInclude });
}

export async function updateProduct(
  id: number,
  data: {
    name?: string;
    description?: string;
    price?: number;
    tags?: string[];
    images?: string[];
  }
) {
  return prisma.product.update({ where: { id }, data, include: productInclude });
}

export async function deleteProduct(id: number) {
  return prisma.product.delete({ where: { id } });
}

export async function findFavorite(productId: number, userId: number) {
  return prisma.favorite.findFirst({ where: { productId, userId } });
}

export async function createFavorite(productId: number, userId: number) {
  return prisma.favorite.create({ data: { productId, userId } });
}

export async function deleteFavorite(productId: number, userId: number) {
  return prisma.favorite.deleteMany({ where: { productId, userId } });
}

export async function findFavoriteUsersByProductId(productId: number) {
  return prisma.favorite.findMany({
    where: { productId },
    select: { userId: true },
  });
}
