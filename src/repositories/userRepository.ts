import prisma from '../lib/prismaClient';
import { Prisma } from '@prisma/client';

export async function findUserById(id: number) {
  return prisma.user.findUnique({ where: { id } });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(data: {
  email: string;
  nickname: string;
  password: string;
  image?: string;
}) {
  return prisma.user.create({ data });
}

export async function updateUser(
  id: number,
  data: { nickname?: string; image?: string; password?: string }
) {
  return prisma.user.update({ where: { id }, data });
}

export async function findProductsByUserId(params: {
  userId: number;
  page: number;
  pageSize: number;
}) {
  const { userId, page, pageSize } = params;
  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user: true,
        _count: { select: { favorites: true, comments: true } },
      },
    }),
    prisma.product.count({ where: { userId } }),
  ]);
  return { products, totalCount };
}

export async function findFavoritesByUserId(params: {
  userId: number;
  page: number;
  pageSize: number;
}) {
  const { userId, page, pageSize } = params;
  const [favorites, totalCount] = await Promise.all([
    prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        product: {
          include: {
            user: true,
            _count: { select: { favorites: true, comments: true } },
          },
        },
      },
    }),
    prisma.favorite.count({ where: { userId } }),
  ]);
  return { favorites, totalCount };
}
