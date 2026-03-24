import { Request, Response } from 'express';
import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import { IdParamsStruct, IdParams } from '../structs/commonStructs.js';
import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
  CreateProductBody,
  UpdateProductBody,
  GetProductListParams,
} from '../structs/productsStruct.js';
import {
  CreateCommentBodyStruct,
  GetCommentListParamsStruct,
  CreateCommentBody,
  GetCommentListParams,
} from '../structs/commentsStruct.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';

export async function createProduct(req: Request, res: Response) {
  const { name, description, price, tags, images } = create(
    req.body,
    CreateProductBodyStruct,
  ) as CreateProductBody;

  const product = await prismaClient.product.create({
    data: { name, description, price, tags, images, userId: req.user!.id },
  });

  res.status(201).send(product);
}

export async function getProduct(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct) as IdParams;
  const userId = req.user?.id; //로그인 여부 확인

  const product = await prismaClient.product.findUnique({ where: { id } });
  if (!product) {
    throw new NotFoundError('product', id);
  }
  let isLiked = false;
  if (userId) {
    const favorite = await prismaClient.favorite.findFirst({
      where: { userId: userId, productId: id },
    });
    isLiked = !!favorite;
  }
  return res.status(200).json({ ...product, isLiked });
}

export async function updateProduct(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct) as IdParams;
  const { name, description, price, tags, images } = create(
    req.body,
    UpdateProductBodyStruct,
  ) as UpdateProductBody;

  const existingProduct = await prismaClient.product.findUnique({ where: { id } });
  if (!existingProduct) {
    throw new NotFoundError('product', id);
  }
  if (existingProduct.userId !== req.user!.id) {
    throw new ForbiddenError('상품 수정 권한이 없습니다.');
  }
  const updatedProduct = await prismaClient.product.update({
    where: { id },
    data: { name, description, price, tags, images },
  });

  return res.status(200).json(updatedProduct);
}

export async function deleteProduct(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct) as IdParams;
  const existingProduct = await prismaClient.product.findUnique({ where: { id } });

  if (!existingProduct) {
    throw new NotFoundError('product', id);
  }
  if (existingProduct.userId !== req.user!.id) {
    throw new ForbiddenError('상품 삭제 권한이 없습니다.');
  }
  await prismaClient.product.delete({ where: { id } });

  return res.status(204).send();
}

export async function getProductList(req: Request, res: Response) {
  const { page, pageSize, orderBy, keyword } = create(
    req.query,
    GetProductListParamsStruct,
  ) as GetProductListParams;
  const userId = req.user?.id; //로그인 여부 확인

  const where = keyword
    ? {
        OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
      }
    : undefined;
  const totalCount = await prismaClient.product.count({ where });
  const products = await prismaClient.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
    where,
    include: {
      favorites: userId
        ? {
            where: { userId },
          }
        : false,
    },
  });
  const listWithLiked = products.map((product) => {
    const { favorites, ...rest } = product;
    return {
      ...rest,
      isLiked: Array.isArray(favorites) && favorites.length > 0,
    };
  });
  return res.send({
    list: listWithLiked,
    totalCount,
  });
}

export async function createComment(req: Request, res: Response) {
  const { id: productId } = create(req.params, IdParamsStruct) as IdParams;
  const { content } = create(req.body, CreateCommentBodyStruct) as CreateCommentBody;

  const existingProduct = await prismaClient.product.findUnique({ where: { id: productId } });
  if (!existingProduct) {
    throw new NotFoundError('product', productId);
  }

  const comment = await prismaClient.comment.create({
    data: { productId, content, userId: req.user!.id },
  });

  return res.status(201).send(comment);
}

export async function getCommentList(req: Request, res: Response) {
  const { id: productId } = create(req.params, IdParamsStruct) as IdParams;
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct) as GetCommentListParams;

  const existingProduct = await prismaClient.product.findUnique({ where: { id: productId } });
  if (!existingProduct) {
    throw new NotFoundError('product', productId);
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

//상품 좋아요, 좋아요취소
export async function favoriteProduct(req: Request, res: Response) {
  const productId = Number(req.params.id);
  const userId = req.user!.id;

  const existingFavorite = await prismaClient.favorite.findFirst({
    where: { userId, productId },
  });

  if (existingFavorite) {
    await prismaClient.favorite.delete({
      where: { id: existingFavorite.id },
    });
    return res.status(200).json({ isLiked: false });
  } else {
    await prismaClient.favorite.create({
      data: { userId, productId },
    });
    return res.status(201).json({ isLiked: true });
  }
}
