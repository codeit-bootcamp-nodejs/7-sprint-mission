import { prisma } from "../../prisma/prisma.js";

// 상품 생성
export const createProduct = async ({ userId, name, description, price, tags }) => {
  return prisma.product.create({
    data: { user_id: userId, name, description, price, tags },
  });
};

// 상품 조회
export const getProductById = async (id, userId = null) => {
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

// 상품 수정
export const updateProduct = async (id, data) => {
  return prisma.product.update({
    where: { id },
    data,
  });
};

// 상품 삭제
export const deleteProduct = async (id) => {
  return prisma.product.delete({
    where: { id },
  });
};

// 상품 목록 조회 (offset)
export const listProducts = async ({ limit, offset, sort, search, userId = null }) => {
  const take = limit ? parseInt(limit, 10) : 3;
  const skip = offset ? parseInt(offset, 10) : 0;

  const findOption = { skip, take };

  if (sort === "recent") {
    findOption.orderBy = { created_at: "desc" };
  }

  if (search) {
    findOption.where = {
      OR: [
        { name: { contains: search } },
        { description: { contains: search } },
      ],
    };
  }

  if (userId) {
    findOption.include = {
      likes: { where: { user_id: userId }, select: { id: true } },
    };
  }

  return prisma.product.findMany(findOption);
};

// 상품 댓글 생성
export const createProductComment = async ({ userId, productId, content }) => {
  return prisma.comment.create({
    data: {
      user_id: userId,
      content,
      product_id: productId,
    },
  });
};

// 상품 댓글 목록 조회 (cursor)
export const listProductCommentsCursor = async ({ productId, limit, cursorId }) => {
  const take = limit ? parseInt(limit, 10) : 5;

  const query = {
    where: { product_id: productId },
    orderBy: { id: "desc" },
    take,
  };

  if (cursorId) {
    const cursor = BigInt(cursorId);
    query.cursor = { id: cursor };
    query.skip = 1;
  }

  const entities = await prisma.comment.findMany(query);

  const last = entities[entities.length - 1];
  const nextCursorId = last ? last.id.toString() : null;

  return { entities, nextCursorId };
};
