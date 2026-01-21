import { Prisma } from '@prisma/client';
import prisma from '../prisma/prisma';
import type { UpdateUserDto } from '../types/user.type';

//유저 조회
export const findUser = async (userId: bigint) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user;
};

//유저 정보 업데이트
export const updateUserRepo = async (userId: bigint, dto: UpdateUserDto) => {
  const { nickname, image } = dto;

  const updateData: Prisma.UserUpdateInput = {
    ...(nickname !== undefined && { nickname }),
    ...(image !== undefined && { image }),
  };

  const updateUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  return updateUser;
};

//패스워드 변경
export const changePasswordRepo = async (userId: bigint, saltedHash: string): Promise<void> => {
  await prisma.user.update({
    where: { id: userId },
    data: { password: saltedHash },
  });
};

export const findUserWithPassword = async (userId: bigint) => {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
};

// 유저가 작성한 상품 목록 조회
export const getMyProductRepo = async (userId: bigint, page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const [product, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where: { userId } }),
  ]);

  return { product, totalCount };
};

//유저가 좋아요한 상품 목록
export const getMyLikedProductsRepo = async (userId: bigint, page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [products, totalCount] = await Promise.all([
    prisma.productLike.findMany({
      where: { userId },
      skip,
      take: limit,
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.productLike.count({ where: { userId } }),
  ]);

  return { products, totalCount };
};

export const getMyLikedArticlesRepo = async (userId: bigint, page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [articles, totalCount] = await Promise.all([
    prisma.articleLike.findMany({
      where: { userId },
      skip,
      take: limit,
      include: { article: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.articleLike.count({ where: { userId } }),
  ]);

  return { articles, totalCount };
};
