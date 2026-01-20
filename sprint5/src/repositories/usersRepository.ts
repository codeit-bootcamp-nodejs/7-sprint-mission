import { prismaClient } from '../lib/prismaClient.js';
import type { Prisma } from '@prisma/client';

export const userRepository = {
  async findByEmail(email: string) {
    return await prismaClient.user.findUnique({
      where: { email },
    });
  },
  async findById(id: number) {
    return await prismaClient.user.findUnique({ where: { id } });
  },
  async create(data: Prisma.UserCreateInput) {
    return await prismaClient.user.create({
      data,
    });
  },
  async update(id: number, data: Prisma.UserUpdateInput) {
    return await prismaClient.user.update({
      where: { id },
      data,
    });
  },

  // '내 상품, 내가 찜한 상품' - Product 테이블 접근 로직
  async findMyProducts(options: { skip: number; take: number; orderBy: any; where: any }) {
    return await prismaClient.product.findMany({
      ...options,
      include: { favorites: true },
    });
  },

  async countProducts(where: any) {
    return await prismaClient.product.count({ where });
  },
};
