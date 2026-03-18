import { prisma } from "../lib/prismaClient";
import { Prisma } from "@prisma/client";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "../services/product.service";

export function createProduct(userId: number, input: CreateProductInput) {
  return prisma.product.create({
    data: {
      name: input.name,
      description: input.description,
      price: input.price,
      tags: input.tags,
      images: input.images,
      userId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      images: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
    },
  });
}

export function findProductById(id: number, userId: number | null) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      likes: userId
        ? {
            where: { userId },
            select: { id: true },
            take: 1,
          }
        : false,
    },
  });
}

export function findProductOwner(id: number) {
  return prisma.product.findUnique({
    where: { id },
    select: { id: true, userId: true },
  });
}

export function updateProduct(id: number, data: UpdateProductInput) {
  return prisma.product.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      images: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export function deleteProduct(id: number) {
  return prisma.product.delete({
    where: { id },
  });
}

type FindProductListArgs = {
  page: number;
  pageSize: number;
  orderBy: "recent" | "old";
  search?: string | null;
  where?: Prisma.ProductWhereInput;
};

export async function findProductList(args: FindProductListArgs) {
  const { page, pageSize, orderBy, where } = args;

  const skip = (page - 1) * pageSize;

  const order: Prisma.ProductOrderByWithRelationInput =
    orderBy === "recent" ? { id: "desc" } : { id: "asc" };

  const totalCount = await prisma.product.count({
    ...(where ? { where } : {}),
  });

  const products = await prisma.product.findMany({
    skip,
    take: pageSize,
    orderBy: order,
    ...(where ? { where } : {}),
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      images: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return { totalCount, products };
}

export function createProductLike(userId: number, productId: number) {
  return prisma.productLike.create({
    data: { userId, productId },
    select: { id: true },
  });
}
export function deleteProductLike(userId: number, productId: number) {
  return prisma.productLike.delete({
    where: {
      userId_productId: { userId, productId },
    },
    select: { id: true },
  });
}

export function findProductComments(params: {
  productId: number;
  cursor: number | null;
  take: number;
}) {
  const { productId, cursor, take } = params;

  return prisma.comment.findMany({
    where: { productId },
    orderBy: { id: "desc" },
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    take,
  });
}
