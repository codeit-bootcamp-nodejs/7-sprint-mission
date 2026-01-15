import type { Request, Response } from 'express';
import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient';
import NotFoundError from '../lib/errors/NotFoundError';
import { IdParamsStruct } from '../structs/commonStructs';
import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from '../structs/productsStruct';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import BadRequestError from '../lib/errors/BadRequestError';

export async function createProduct(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const data = create(req.body, CreateProductBodyStruct);

  const createdProduct = await prismaClient.product.create({
    data: {
      ...data,
      userId: req.user.id,
    },
  });

  res.status(201).send(createdProduct);
}

export async function getProduct(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);

  const product = await prismaClient.product.findUnique({
    where: { id: Number(id) },
    include: { likes: true }, // 스키마 필드명에 맞춰 likes로 수정
  });

  if (!product) {
    throw new NotFoundError('product', id.toString());
  }

  const productWithFavorites = {
    ...product,
    likes: undefined,
    favoriteCount: product.likes.length,
    isFavorited: req.user ? product.likes.some((like) => like.userId === req.user?.id) : false,
  };

  return res.send(productWithFavorites);
}

export async function updateProduct(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id } = create(req.params, IdParamsStruct);
  const { name, description, price, tags, images } = create(req.body, UpdateProductBodyStruct);

  const existingProduct = await prismaClient.product.findUnique({
    where: { id: Number(id) },
  });

  if (!existingProduct) {
    throw new NotFoundError('product', id.toString());
  }

  if (existingProduct.userId !== req.user.id) {
    throw new ForbiddenError('Should be the owner of the product');
  }

  const updatedProduct = await prismaClient.product.update({
    where: { id: Number(id) },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price }),
      ...(tags !== undefined && { tags }),
      ...(images !== undefined && { images }),
    },
  });

  return res.send(updatedProduct);
}

export async function deleteProduct(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id } = create(req.params, IdParamsStruct);
  const existingProduct = await prismaClient.product.findUnique({
    where: { id: Number(id) },
  });

  if (!existingProduct) {
    throw new NotFoundError('product', id.toString());
  }

  if (existingProduct.userId !== req.user.id) {
    throw new ForbiddenError('Should be the owner of the product');
  }

  await prismaClient.product.delete({ where: { id: Number(id) } });
  return res.status(204).send();
}

export async function getProductList(req: Request, res: Response) {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetProductListParamsStruct);

  const where = keyword
    ? {
        OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
      }
    : undefined;

  const totalCount = await prismaClient.product.count({
    ...(where && { where }),
  });
  const products = await prismaClient.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
    ...(where && { where }),
    include: {
      likes: true,
    },
  });

  const productsWithFavorites = products.map((product) => ({
    ...product,
    likes: undefined,
    favoriteCount: product.likes.length,
    isFavorited: req.user ? product.likes.some((like) => like.userId === req.user?.id) : false,
  }));

  return res.send({
    list: productsWithFavorites,
    totalCount,
  });
}

export async function createComment(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id: productId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);

  const existingProduct = await prismaClient.product.findUnique({
    where: { id: Number(productId) },
  });
  if (!existingProduct) {
    throw new NotFoundError('product', productId.toString());
  }

  const createdComment = await prismaClient.comment.create({
    data: { productId: Number(productId), content, userId: req.user.id },
  });

  return res.status(201).send(createdComment);
}

export async function getCommentList(req: Request, res: Response) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const existingProduct = await prismaClient.product.findUnique({
    where: { id: Number(productId) },
  });
  if (!existingProduct) {
    throw new NotFoundError('product', productId.toString());
  }

  const commentsWithCursorComment = await prismaClient.comment.findMany({
    ...(cursor && { cursor: { id: Number(cursor) } }),
    take: limit + 1,
    where: { productId: Number(productId) },
  });

  const comments = commentsWithCursorComment.slice(0, limit);
  const cursorComment = commentsWithCursorComment[comments.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  return res.send({
    list: comments,
    nextCursor,
  });
}

export async function createFavorite(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id: productId } = create(req.params, IdParamsStruct);

  const existingProduct = await prismaClient.product.findUnique({
    where: { id: Number(productId) },
  });
  if (!existingProduct) {
    throw new NotFoundError('product', productId.toString());
  }

  const existingFavorite = await prismaClient.like.findFirst({
    where: { productId: Number(productId), userId: req.user.id },
  });
  if (existingFavorite) {
    throw new BadRequestError('Already favorited');
  }

  await prismaClient.like.create({
    data: { productId: Number(productId), userId: req.user.id },
  });
  return res.status(201).send();
}

export async function deleteFavorite(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id: productId } = create(req.params, IdParamsStruct);

  const existingFavorite = await prismaClient.like.findFirst({
    where: { productId: Number(productId), userId: req.user.id },
  });
  if (!existingFavorite) {
    throw new BadRequestError('Not favorited');
  }

  await prismaClient.like.delete({ where: { id: existingFavorite.id } });
  return res.status(204).send();
}
