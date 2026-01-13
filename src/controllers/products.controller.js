import { prisma } from "../lib/prismaClient.js";
import {
  NotFoundError,
  ConflictError,
  BadRequestError,
} from "../lib/errors.js";
import { IdParams } from "../validation/commons.js";
import {
  CreateProduct,
  GetProductList,
  UpdateProduct,
} from "../validation/products.js";
import { CreateComment, GetCommentListParams } from "../validation/comments.js";

export async function createProduct(req, res) {
  const userId = req.user.id;
  const { name, description, price, tags, images } = CreateProduct.parse(
    req.body
  );

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      tags,
      images,
      userId,
    },
  });

  res.status(201).send(product);
}

export async function getProduct(req, res) {
  const { id } = IdParams.parse(req.params);
  const userId = req.user?.id ?? null;

  const product = await prisma.product.findUnique({
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

  if (!product) {
    throw new NotFoundError("product", id);
  }

  const isLiked = userId ? product.likes.length > 0 : false;
  return res.send({
    ...product,
    isLiked,
    likes: undefined,
  });
}

export async function updateProduct(req, res) {
  const { id } = IdParams.parse(req.params);
  const data = UpdateProduct.parse(req.body);

  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });
  if (!existingProduct) {
    throw new NotFoundError("product", id);
  }

  if (existingProduct.userId !== userId) {
    return res.status(403).json({ message: "작성자만 수정할 수 있습니다." });
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data,
  });

  return res.send(updatedProduct);
}

export async function deleteProduct(req, res) {
  const { id } = IdParams.parse(req.params);
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });
  if (!existingProduct) {
    throw new NotFoundError("product", id);
  }
  if (existingProduct.userId !== userId) {
    return res.status(403).json({ message: "작성자만 삭제할 수 있습니다." });
  }

  await prisma.product.delete({ where: { id } });
  return res.status(204).send();
}

export async function getProductList(req, res) {
  const { page, pageSize, orderBy, keyword } = GetProductList.parse(req.query);

  const where = keyword
    ? {
        OR: [
          { name: { contains: keyword } },
          { description: { contains: keyword } },
        ],
      }
    : undefined;
  const totalCount = await prisma.product.count({ where });
  const products = await prisma.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === "recent" ? { id: "desc" } : { id: "asc" },
    where,
  });

  return res.send({
    list: products,
    totalCount,
  });
}
//product comment 관련
export async function createProductComment(req, res) {
  const userId = req.user.id;
  const { id: productId } = IdParams.parse(req.params);
  const { content } = CreateComment.parse(req.body);

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });
  if (!product) throw new NotFoundError("product", productId);

  const comment = await prisma.comment.create({
    data: { content, userId, productId },
  });

  return res.status(201).json(comment);
}

export async function getCommentList(req, res) {
  const { id: productId } = create(req.params, IdParams);
  const { cursor, limit } = create(req.query, GetCommentListParams);

  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!existingProduct) {
    throw new NotFoundError("product", productId);
  }

  const fetched = await prisma.comment.findMany({
    where: { productId },
    orderBy: { id: "desc" },
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : undefined,
    take: limit + 1,
  });

  const hasNext = fetched.length > limit;
  const list = fetched.slice(0, limit);
  const nextCursor = hasNext ? list[list.length - 1].id : null;

  return res.send({ list, nextCursor });
}

const ensureProductExists = async (productId) => {
  const p = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });
  if (!p) throw new NotFoundError("product", productId);
};

export const likeProduct = async (req, res) => {
  const userId = req.user.id;
  const productId = Number(req.params.productId);

  await ensureProductExists(productId);

  try {
    await prisma.productLike.create({
      data: { userId, productId },
    });
  } catch (e) {
    if (e?.code === "P2002") {
      throw new ConflictError("이미 좋아요한 상품입니다.");
    }
    throw e;
  }

  return res.status(201).json({ message: "liked" });
};

export const unlikeProduct = async (req, res) => {
  const userId = req.user.id;
  const productId = Number(req.params.productId);

  await ensureProductExists(productId);

  try {
    await prisma.productLike.delete({
      where: {
        userId_productId: { userId, productId },
      },
    });
  } catch (e) {
    if (e?.code === "P2025") {
      throw new BadRequestError("좋아요하지 않은 상품입니다.");
    }
    throw e;
  }

  return res.status(200).json({ message: "unliked" });
};
