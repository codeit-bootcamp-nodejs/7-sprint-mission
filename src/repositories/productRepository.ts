import { prisma } from '../lib/prismaClient';
import { Prisma } from '@prisma/client';
import { CreateProductBody, UpdateProductBody } from '../structs/productsStruct';

export const productRepository = {
  async findById(id: number) {
    return prisma.product.findUnique({
      where: { id },
      include: { _count: { select: { likes: true } } },
    });
  },

  async findList(skip: number, take: number, orderBy: 'recent' | undefined, keyword?: string, userId?: number, isLikedFilter: boolean = false) {
    const where: Prisma.ProductWhereInput = {};
    if (keyword) {
      where.OR = [{ name: { contains: keyword } }, { description: { contains: keyword } }];
    }
    if (userId) {
      if (isLikedFilter) {
        where.likes = { some: { userId } }; 
      } else {
        where.userId = userId; 
      }
    }

    return prisma.product.findMany({
      skip,
      take,
      orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
      where,
    });
  },

  async count(keyword?: string, userId?: number, isLikedFilter: boolean = false) {
    const where: Prisma.ProductWhereInput = {};
    if (keyword) {
      where.OR = [{ name: { contains: keyword } }, { description: { contains: keyword } }];
    }
    if (userId) {
      if (isLikedFilter) {
        where.likes = { some: { userId } };
      } else {
        where.userId = userId;
      }
    }
    return prisma.product.count({ where });
  },


  async create(userId: number, data: CreateProductBody) {
    return prisma.product.create({
      data: { ...data, userId },
    });
  },

  async update(id: number, data: UpdateProductBody) {
    return prisma.product.update({
      where: { id },
      data,
    });
  },

  async delete(id: number) {
    return prisma.product.delete({ where: { id } });
  },

  async findLike(userId: number, productId: number) {
    return prisma.productLike.findUnique({
      where: { userId_productId: { userId, productId } },
    });
  },

  async addLike(userId: number, productId: number) {
    return prisma.productLike.create({ data: { userId, productId } });
  },

  async removeLike(id: number) {
    return prisma.productLike.delete({ where: { id } });
  },

  async findLikers(productId: number) {
    return prisma.productLike.findMany({
      where: { productId },
      select: { userId: true },
    });
  },
};