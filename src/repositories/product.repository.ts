import { prisma } from "../../prisma/prisma.js";
import type { ProductSort } from "../dtos/product.dto.js";

export const createProduct = async (data: {
  userId: bigint;
  name: string;
  price: number;
  description?: string;
  tags: string[];
}) => {
  return prisma.product.create({
    data: {
      user_id: data.userId,
      name: data.name,
      price: data.price,
      description: data.description,
      tags: data.tags,
    },
  });
};

export const findProductById = async (params: { id: bigint; userId: bigint | null }) => {
  const { id, userId } = params;

  return prisma.product.findUnique({
    where: { id },
    ...(userId
      ? {
          include: {
            likes: {
              where: { user_id: userId },
              select: { id: true },
            },
          },
        }
      : {}),
  });
};

export const updateProductById = async (params: {
  id: bigint;
  data: {
    name?: string;
    price?: number;
    description?: string;
    tags?: string[];
  };
}) => {
  return prisma.product.update({
    where: { id: params.id },
    data: params.data,
  });
};

export const deleteProductById = async (id: bigint) => {
  return prisma.product.delete({ where: { id } });
};

export const findProducts = async (params: {
  skip: number;
  take: number;
  sort?: ProductSort;
  search?: string;
  userId: bigint | null;
}) => {
  const { skip, take, sort, search, userId } = params;

  const findOption: {
    skip: number;
    take: number;
    orderBy?: { created_at: "desc" };
    where?: {
      OR: Array<{ name?: { contains: string } } | { description?: { contains: string } }>;
    };
    include?: {
      likes: { where: { user_id: bigint }; select: { id: true } };
    };
  } = { skip, take };

  if (!sort || sort === "recent") {
    findOption.orderBy = { created_at: "desc" };
  }

  if (search) {
    findOption.where = {
      OR: [{ name: { contains: search } }, { description: { contains: search } }],
    };
  }

  if (userId) {
    findOption.include = {
      likes: { where: { user_id: userId }, select: { id: true } },
    };
  }

  return prisma.product.findMany(findOption);
};

export const createProductComment = async (data: {
  userId: bigint;
  productId: bigint;
  content: string;
}) => {
  return prisma.comment.create({
    data: {
      user_id: data.userId,
      product_id: data.productId,
      content: data.content,
    },
  });
};

export const findProductCommentsCursor = async (params: {
  productId: bigint;
  take: number;
  cursorId?: bigint;
}) => {
  const query: {
    where: { product_id: bigint };
    orderBy: { id: "desc" };
    take: number;
    cursor?: { id: bigint };
    skip?: number;
  } = {
    where: { product_id: params.productId },
    orderBy: { id: "desc" },
    take: params.take,
  };

  if (params.cursorId) {
    query.cursor = { id: params.cursorId };
    query.skip = 1;
  }

  const entities = await prisma.comment.findMany(query);
  const last = entities[entities.length - 1];
  const nextCursorId = last ? last.id.toString() : null;

  return { entities, nextCursorId };
};
