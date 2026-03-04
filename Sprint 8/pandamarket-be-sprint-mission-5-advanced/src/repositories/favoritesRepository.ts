import { Favorite, PrismaClient } from '@prisma/client';
import { prismaClient } from '../lib/prismaClient';
const prisma = new PrismaClient();

export async function createFavorite(data: Omit<Favorite, 'id' | 'createdAt' | 'updatedAt'>) {
  const createdFavorite = await prismaClient.favorite.create({
    data,
  });
  return createdFavorite;
}

export async function getFavorite(productId: number, userId: number) {
  const favorite = await prismaClient.favorite.findFirst({
    where: { productId, userId },
  });
  return favorite;
}

export async function deleteFavorite(id: number) {
  await prismaClient.favorite.delete({
    where: { id },
  });
}

export async function getFavoriteUserIdsByProductId(productId: number): Promise<number[]> {
  const favorites = await prisma.favorite.findMany({
    where: { productId },
    select: { userId: true },
  });
  return favorites.map((f) => f.userId);
}
