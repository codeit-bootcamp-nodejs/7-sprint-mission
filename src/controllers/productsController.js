import { boolean, create } from "superstruct";
import { prismaClient } from "../lib/prismaClient.js";
import NotFoundError from "../lib/errors/NotFoundError.js";
import BadRequestError from "../lib/errors/BadRequestError.js";
import { IdParamsStruct } from "../structs/commonStructs.js";
import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from "../structs/productsStruct.js";
import {
  CreateCommentBodyStruct,
  GetCommentListParamsStruct,
} from "../structs/commentsStruct.js";

export async function createProduct(req, res) {
  const { name, description, price, tags, images } = create(
    req.body,
    CreateProductBodyStruct
  );

  const product = await prismaClient.product.create({
    data: { name, description, price, tags, images, userId: req.user.id },
  });

  res.status(201).send(product);
}

export async function getProduct(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const product = await prismaClient.product.findUnique({ where: { id } });
  if (!product) {
    throw new NotFoundError("product", id);
  }

  const isFavorited = await prismaClient.favorite.findFirst({
    where: { userId: product.userId, productId: id },
  });
  return res.send({ product: product, isLike: boolean(isFavorited) });
}

export async function updateProduct(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const { name, description, price, tags, images } = create(
    req.body,
    UpdateProductBodyStruct
  );

  const existingProduct = await prismaClient.product.findUnique({
    where: { id },
  });
  if (!existingProduct) {
    throw new NotFoundError("product", id);
  }
  if (existingProduct.userId !== req.user.id) {
    throw new BadRequestError("제품 등록한 유저정보가 맞지 않습니다.");
  }

  const updatedProduct = await prismaClient.product.update({
    where: { id },
    data: { name, description, price, tags, images },
  });

  return res.send(updatedProduct);
}

export async function deleteProduct(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const existingProduct = await prismaClient.product.findUnique({
    where: { id },
  });

  if (!existingProduct) {
    throw new NotFoundError("product", id);
  }

  if (existingProduct.userId !== req.user.id) {
    throw new BadRequestError("제품 등록한 유저정보가 맞지 않습니다.");
  }

  await prismaClient.product.delete({ where: { id } });

  return res.status(204).send();
}

export async function getProductList(req, res) {
  const { page, pageSize, orderBy, keyword } = create(
    req.query,
    GetProductListParamsStruct
  );

  const where = keyword
    ? {
        OR: [
          { name: { contains: keyword } },
          { description: { contains: keyword } },
        ],
      }
    : undefined;
  const totalCount = await prismaClient.product.count({ where });
  const products = await prismaClient.product.findMany({
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

export async function createComment(req, res) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);

  const existingProduct = await prismaClient.product.findUnique({
    where: { id: productId },
  });
  if (!existingProduct) {
    throw new NotFoundError("product", productId);
  }

  const comment = await prismaClient.comment.create({
    data: { productId, content, userId: req.user.id },
  });

  return res.status(201).send(comment);
}

export async function getCommentList(req, res) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const existingProduct = await prismaClient.product.findUnique({
    where: { id: productId },
  });
  if (!existingProduct) {
    throw new NotFoundError("product", productId);
  }

  const commentsWithCursorComment = await prismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { productId },
  });
  const comments = commentsWithCursorComment.slice(0, limit);
  const cursorComment = commentsWithCursorComment[comments.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  return res.send({
    list: comments,
    nextCursor,
  });
}

export async function favoriteProduct(req, res) {
  try {
    const { id } = create(req.params, IdParamsStruct);
    const userId = req.user.id;
    const favorite = await prismaClient.favorite.create({
      data: { userId, productId: id },
    });
    res.status(200).send(favorite);
  } catch (error) {
    return res.status(400).send({ message: "Already Favorite" });
  }
}
export async function disfavoriteProduct(req, res) {
  try {
    const { id } = create(req.params, IdParamsStruct);
    const userId = req.user.id;

    const existinglikeFavorite = await prismaClient.favorite.findFirst({
      where: { productId: id, userId: userId },
    });

    if (!existinglikeFavorite) {
      throw new NotFoundError("no liked Product", existinglikeFavorite.id);
    }
    const disfavorite = await prismaClient.favorite.delete({
      where: { id: existinglikeFavorite.id },
    });
    res.status(200).send(disfavorite);
  } catch (error) {
    return res.status(400).send({ message: "Already DisFavorite" });
  }
}
