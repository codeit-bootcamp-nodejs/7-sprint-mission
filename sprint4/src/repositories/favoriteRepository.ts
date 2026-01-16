import { PrismaClient, Favorite } from '@prisma/client';
import { IFavoriteRepository } from './interfaces/IFavoriteRepository.js';

export class FavoriteRepository implements IFavoriteRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: { productId: number; userId: number }): Promise<Favorite> {
    return this.prisma.favorite.create({
      data,
    });
  }

  async findByProductAndUser(productId: number, userId: number): Promise<Favorite | null> {
    return this.prisma.favorite.findFirst({
      where: { productId, userId },
    });
  }

  async findManyByUserId(userId: number, params: {
    skip: number;
    take: number;
    orderBy: 'desc' | 'asc';
    keyword?: string;
  }) {
    const where = {
      userId,
      ...(params.keyword
        ? {
            product: {
              OR: [
                { name: { contains: params.keyword } },
                { description: { contains: params.keyword } },
              ],
            },
          }
        : {}),
    };

    return this.prisma.favorite.findMany({
      skip: params.skip,
      take: params.take,
      orderBy: { id: params.orderBy },
      where,
      include: { product: { include: { favorites: true } } },
    });
  }

  async countByUserId(userId: number, keyword?: string): Promise<number> {
    const where = {
      userId,
      ...(keyword
        ? {
            product: {
              OR: [
                { name: { contains: keyword } },
                { description: { contains: keyword } },
              ],
            },
          }
        : {}),
    };

    return this.prisma.favorite.count({ where });
  }

  async delete(id: number): Promise<Favorite> {
    return this.prisma.favorite.delete({
      where: { id },
    });
  }
}
