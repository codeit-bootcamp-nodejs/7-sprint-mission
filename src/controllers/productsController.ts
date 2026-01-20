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
    include: { likes: true },
  });

  if (!product) {
    throw new NotFoundError('product', id.toString());
  }

  const productWithLikes = {
    ...product,
    likes: undefined,
    likeCount: product.likes.length,
    isLiked: req.user ? product.likes.some((like) => like.userId === req.user?.id) : false,
  };

  return res.send(productWithLikes);
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

  const productsWithLikes = products.map((product) => ({
    ...product,
    likes: undefined,
    likeCount: product.likes.length,
    isLiked: req.user ? product.likes.some((like) => like.userId === req.user?.id) : false,
  }));

  return res.send({
    list: productsWithLikes,
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

  const commentsWithCursor = await prismaClient.comment.findMany({
    where: { productId: Number(productId) },
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    ...(cursor ? { cursor: { id: Number(cursor) } } : {}),
  });

  const comments = commentsWithCursor.slice(0, limit);
  const nextCursor =
    commentsWithCursor.length > limit ? comments[comments.length - 1]?.id ?? null : null;
  return res.send({
    list: comments,
    nextCursor,
  });
}

export async function createLike(req: Request, res: Response) {
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

  const existingLike = await prismaClient.like.findFirst({
    where: { productId: Number(productId), userId: req.user.id },
  });
  if (existingLike) {
    throw new BadRequestError('Already liked');
  }

  await prismaClient.like.create({
    data: { productId: Number(productId), userId: req.user.id },
  });
  return res.status(201).send();
}

export async function deleteLike(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id: productId } = create(req.params, IdParamsStruct);

  const existingLike = await prismaClient.like.findFirst({
    where: { productId: Number(productId), userId: req.user.id },
  });
  if (!existingLike) {
    throw new BadRequestError('Not liked');
  }

  await prismaClient.like.delete({ where: { id: existingLike.id } });
  return res.status(204).send();
}
