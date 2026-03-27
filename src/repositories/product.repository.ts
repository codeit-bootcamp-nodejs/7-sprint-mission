import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

const productInclude = {
  author: { select: { id: true, nickname: true, image: true } },
  _count: { select: { likes: true } },
} as const;

export async function findProducts(params: {
  skip: number;
  take: number;
  keyword?: string;
}) {
  const where: Prisma.ProductWhereInput = params.keyword
    ? {
        OR: [
          { name: { contains: params.keyword, mode: 'insensitive' } },
          { description: { contains: params.keyword, mode: 'insensitive' } },
        ],
      }
    : {};

  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: 'desc' },
      include: productInclude,
    }),
    prisma.product.count({ where }),
  ]);

  return { data, total };
}

export async function findProductById(id: number) {
  return prisma.product.findUnique({ where: { id }, include: productInclude });
}

export async function createProduct(data: Prisma.ProductCreateInput) {
  return prisma.product.create({ data, include: productInclude });
}

export async function updateProduct(id: number, data: Prisma.ProductUpdateInput) {
  return prisma.product.update({ where: { id }, data, include: productInclude });
}

export async function deleteProduct(id: number) {
  return prisma.product.delete({ where: { id } });
}

export async function findUserProducts(authorId: number, params: { skip: number; take: number }) {
  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where: { authorId },
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: 'desc' },
      include: productInclude,
    }),
    prisma.product.count({ where: { authorId } }),
  ]);
  return { data, total };
}

export async function findLikedProducts(userId: number, params: { skip: number; take: number }) {
  const [likes, total] = await Promise.all([
    prisma.productLike.findMany({
      where: { userId },
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: 'desc' },
      include: {
        product: { include: productInclude },
      },
    }),
    prisma.productLike.count({ where: { userId } }),
  ]);
  return { data: likes.map((l) => l.product), total };
}
