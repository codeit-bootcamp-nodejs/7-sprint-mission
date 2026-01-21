import prisma from '../prisma/prisma';
import type { Prisma } from '@prisma/client';
import type { CreateProductDto, UpdateProductDto } from '../types/product.type';
import { cursorPaginationOption } from '../utils/cursorPagination';

// 상품 존재여부 확인 로직
export const findDetailProduct = async (productId: bigint) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  return product;
};

interface FindOption {
  skip: number;
  take: number;
  orderBy: Prisma.ProductOrderByWithRelationInput;
  where?: Prisma.ProductWhereInput;
}

// 페이지네이션 및 검색어에 따른 조회 옵션 생성
function getFindOption(page: number, limit: number, keyword: string | undefined) {
  const skip = (page - 1) * limit;

  const findOption: FindOption = {
    take: limit,
    skip,
    orderBy: { createdAt: 'desc' },
  };

  if (keyword) {
    const searchFilter: Prisma.StringFilter = {
      contains: keyword,
      mode: 'insensitive',
    };

    findOption.where = {
      OR: [{ name: searchFilter }, { description: searchFilter }],
    };
  }

  return findOption;
}

//상품 목록 조회
export const getProductListRepo = async (
  limit: number,
  page: number,
  keyword: string | undefined,
  userId: bigint | null,
) => {
  const findOption = getFindOption(page, limit, keyword);

  const [entities, totalCount] = await Promise.all([
    prisma.product.findMany({
      ...findOption,
      include: {
        likes: userId ? { where: { userId }, select: { id: true } } : false,
      },
    }),
    prisma.product.count({ where: findOption.where ?? {} }),
  ]);

  return { entities, totalCount };
};

// 상품 상세 조회
export const getProductDetailRepo = async (productId: bigint, userId: bigint | null) => {
  const entity = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      likes: userId ? { where: { userId }, select: { id: true } } : false,
    },
  });

  return entity;
};

//상품 등록
export const createProductRepo = async (userId: bigint, dto: CreateProductDto) => {
  const { name, description, price, tags } = dto;

  const createEntity = await prisma.product.create({
    data: {
      userId,
      name,
      description,
      price,
      tags,
    },
  });
  return createEntity;
};

//상품 수정
export const updateProductRepo = async (productId: bigint, dto: UpdateProductDto) => {
  const { name, description, price, tags, images } = dto;

  const updateData: Prisma.ProductUpdateInput = {
    ...(name !== undefined && { name }),
    ...(description !== undefined && { description }),
    ...(price !== undefined && { price }),
    ...(tags !== undefined && { tags: { set: tags! } }),
    ...(images !== undefined && { images: { set: images! } }),
  };

  const updatedEntity = await prisma.product.update({
    where: { id: productId },
    data: updateData,
  });

  return updatedEntity;
};

// 상품 삭제
export const deleteProductRepo = async (productId: bigint): Promise<void> => {
  await prisma.product.delete({
    where: { id: productId },
  });
};

//상품 댓글 등록
export const createProductCommentRepo = async (
  userId: bigint,
  productId: bigint,
  content: string,
) => {
  const comment = await prisma.comment.create({
    data: {
      content,
      productId,
      userId: userId,
    },
  });

  return comment;
};

// 상품 댓글 조회
export const getProductCommentRepo = async (
  productId: bigint,
  limit: number,
  cursor: bigint | undefined,
) => {
  const entities = await prisma.comment.findMany(
    cursorPaginationOption({
      cursor,
      limit: limit + 1,
      where: { productId },
    }),
  );

  return entities;
};
