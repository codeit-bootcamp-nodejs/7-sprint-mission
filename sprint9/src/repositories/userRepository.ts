import { User } from '@prisma/client';
import { prismaClient } from '../lib/prismaClient';

export async function getUserWithEmail(email: string) {
  return prismaClient.user.findUnique({ where: { email } });
}
export async function createUser(data: Omit<User, 'id' | 'image' | 'createdAt' | 'updatedAt'> & { image?: string }) {
  return prismaClient.user.create({ data });
}
export async function loginUser(email: string) {
  return prismaClient.user.findUnique({ where: { email: email } });
}
export async function refreshUserToken(userId: number) {
  return prismaClient.user.findUnique({ where: { id: userId } });
}

export async function getMe(userId: number) {
  return prismaClient.user.findUnique({ where: { id: userId } });
} 

export async function updateUser(userId: number, data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>) {
  return prismaClient.user.update({
    where: { id: userId },
    data,
  });
}

export async function updateUserPassword(userId: number, hashedPassword: string) {
  return prismaClient.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
} 

export async function getUserById(userId: number) {
  return prismaClient.user.findUnique({ where: { id: userId } });
}

export async function getMyProductList(
  userId: number,
  params: {
    skip: number;
    take: number;
    orderBy: 'recent' | 'oldest';
    where?: object;
  }              
) {
  const products = prismaClient.product.findMany({
    skip: params.skip,
    take: params.take,
    orderBy: params.orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
    where: {
      ...params.where,
      userId,
    },
    include: {
      favorites: true,
    },
  });
  return products;
}
export async function countMyProducts(userId: number, where?: object) {
   const count = prismaClient.product.count({
    where: {
      ...where,
      userId,
    },
  });
  return count;
}  

export async function getMyFavoriteList (
  userId: number,
  params: {
    skip: number;
    take: number;
    orderBy: 'recent' | 'oldest';
    where?: object;
  }              
) {
  const products = prismaClient.product.findMany({
    skip: params.skip,
    take: params.take,
    orderBy: params.orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
    where: {
      ...params.where,
      favorites: {
        some: {
          userId,
        },
      },
    },
    include: {
      favorites: true,
    },
  });
  return products;
}     
export async function countMyFavorites(userId: number, where?: object) {
   const count = prismaClient.product.count({
    where: {
      ...where,
      favorites: {
        some: {
          userId,
        },
      },
    },
  });
  return count;
}
    