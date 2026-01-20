import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import { BadRequestError } from '../lib/errors/BadRequestError.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import { CreateProductBodyStruct, GetProductListParamsStruct, UpdateProductBodyStruct } from '../structs/productsStruct.js';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct.js';

export const createProduct = async (req, res) => {
  const data = create(req.body, CreateProductBodyStruct);
  const product = await prismaClient.product.create({
    data: { ...data, user: { connect: { id: req.user.id } } },
  });
  res.status(201).json(product);
};

export const getProduct = async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const product = await prismaClient.product.findUnique({
    where: { id },
    include: { _count: { select: { likes: true } } },
  });
  if (!product) throw new NotFoundError('product', id);

  let isLiked = false;
  if (req.user) {
    const like = await prismaClient.like.findUnique({
      where: { userId_productId: { userId: req.user.id, productId: id } },
    });
    isLiked = !!like;
  }
  res.json({ ...product, likeCount: product._count.likes, isLiked });
};

export const updateProduct = async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateProductBodyStruct);
  const product = await prismaClient.product.findUnique({ where: { id } });
  if (!product) throw new NotFoundError('product', id);
  if (product.userId !== req.user.id) throw new BadRequestError('권한이 없습니다.');

  const updated = await prismaClient.product.update({ where: { id }, data });
  res.json(updated);
};

export const deleteProduct = async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const product = await prismaClient.product.findUnique({ where: { id } });
  if (!product) throw new NotFoundError('product', id);
  if (product.userId !== req.user.id) throw new BadRequestError('권한이 없습니다.');

  await prismaClient.product.delete({ where: { id } });
  res.status(204).send();
};

export const getProductList = async (req, res) => {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetProductListParamsStruct);
  const where = keyword ? { OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }] } : {};
  const [totalCount, list] = await Promise.all([
    prismaClient.product.count({ where }),
    prismaClient.product.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
      where,
    }),
  ]);
  res.json({ list, totalCount });
};

export const toggleProductLike = async (req, res) => {
  const { id: productId } = create(req.params, IdParamsStruct);
  const where = { userId_productId: { userId: req.user.id, productId } };
  const existing = await prismaClient.like.findUnique({ where });

  if (existing) {
    await prismaClient.like.delete({ where });
    res.json({ isLiked: false });
  } else {
    await prismaClient.like.create({
      data: { user: { connect: { id: req.user.id } }, product: { connect: { id: productId } } },
    });
    res.json({ isLiked: true });
  }
};

export const createComment = async (req, res) => {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);

  const product = await prismaClient.product.findUnique({ where: { id: productId } });
  if (!product) throw new NotFoundError('product', productId);

  const comment = await prismaClient.comment.create({
    data: {
      content,
      product: { connect: { id: productId } },
      user: { connect: { id: req.user.id } },
    },
  });
  res.status(201).json(comment);
};

export const getCommentList = async (req, res) => {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const product = await prismaClient.product.findUnique({ where: { id: productId } });
  if (!product) throw new NotFoundError('product', productId);

  const commentsWithCursor = await prismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { productId },
    orderBy: { createdAt: 'desc' },
  });

  const list = commentsWithCursor.slice(0, limit);
  const nextCursor = commentsWithCursor.length > limit ? commentsWithCursor[limit].id : null;

  res.json({ list, nextCursor });
};