import { prismaClient } from '../lib/prismaClient.js';
import type { Prisma } from '@prisma/client';

export const productRepository = {
  async findById(id: number) {
    return await prismaClient.product.findUnique({
      where: { id },
      include: { favorites: true },
    });
  },

  async findMany(options: { skip: number; take: number; orderBy: any; where: any }) {
    return await prismaClient.product.findMany({
      ...options,
      include: { favorites: true },
    });
  },

  async count(where: any) {
    return await prismaClient.product.count({ where });
  },

  async create(data: Prisma.ProductUncheckedCreateInput) {
    return await prismaClient.product.create({ data });
  },

  async update(id: number, data: Prisma.ProductUpdateInput) {
    return await prismaClient.product.update({ where: { id }, data });
  },

  async delete(id: number) {
    return await prismaClient.product.delete({ where: { id } });
  },

  // Favorite 관련
  async findFavorite(productId: number, userId: number) {
    return await prismaClient.favorite.findFirst({ where: { productId, userId } });
  },

  async createFavorite(productId: number, userId: number) {
    return await prismaClient.favorite.create({ data: { productId, userId } });
  },

  async deleteFavorite(id: number) {
    return await prismaClient.favorite.delete({ where: { id } });
  },
};
