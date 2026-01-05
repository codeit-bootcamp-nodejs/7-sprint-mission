import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from '../structs/productsStruct.js';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct.js';

export async function createProduct(req, res) {
  const { name, description, price, tags, images } = create(req.body, CreateProductBodyStruct);

  const product = await prismaClient.product.create({
    data: { name, description, price, tags, images, userId: req.user.id },
  });

  res.status(201).send(product);
}

export async function getProduct(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const currentUserId = req.user?.id;
  const product = await prismaClient.product.findUnique({
    where: { id },
    include: {
      // 로그인했다면 내 좋아요 기록이 있는지 함께 가져옴
      ProductLikes: currentUserId ? { where: { userId: currentUserId } } : false,
    },
  });
  if (!product) {
    throw new NotFoundError('product', id);
  }
  // isLiked 필드 동적 생성
  // 내부 데이터는 삭제하고 전달
  const response = {
    ...product,
    isLiked: !!(product.ProductLikes && product.ProductLikes.length > 0),
  };
  delete response.ProductLikes;

  return res.send(response);
}

export async function updateProduct(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const { name, description, price, tags, images } = create(req.body, UpdateProductBodyStruct);

  const existingProduct = await prismaClient.product.findUnique({ where: { id } });
  if (!existingProduct) {
    throw new NotFoundError('product', id);
  }
  // [인가 체크] 상품 등록자와 로그인 유저가 다르면 에러
  if (existingProduct.userId !== req.user.id) {
    return res.status(403).json({ message: '본인이 등록한 상품만 수정할 수 있습니다' });
  }

  const updatedProduct = await prismaClient.product.update({
    where: { id },
    data: { name, description, price, tags, images },
  });

  return res.send(updatedProduct);
}

export async function deleteProduct(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const existingProduct = await prismaClient.product.findUnique({ where: { id } });

  if (!existingProduct) {
    throw new NotFoundError('product', id);
  }

  // [인가 체크] 상품 등록자와 로그인 유저가 다르면 에러
  if (existingProduct.userId !== req.user.id) {
    return res.status(403).json({ message: '본인이 등록한 상품만 삭제할 수 있습니다.' });
  }

  await prismaClient.product.delete({ where: { id } });

  return res.status(204).send();
}

export async function getProductList(req, res) {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetProductListParamsStruct);

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
  });

  return res.send({
    list: products,
    totalCount,
  });
}

export async function createComment(req, res) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);

  const existingProduct = await prismaClient.product.findUnique({ where: { id: productId } });
  if (!existingProduct) {
    throw new NotFoundError('product', productId);
  }

  const comment = await prismaClient.comment.create({
    data: { productId, content, userId: req.user.id },
  });

  return res.status(201).send(comment);
}

export async function getCommentList(req, res) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

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
} // ## 상품 좋아요 토글
export async function toggleProductLike(req, res) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const userId = req.user.id;

  // 1. 이미 좋아요를 눌렀는지 확인
  const existingLike = await prismaClient.productLike.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  // 2. 이미 있다면 삭제 (좋아요 취소)
  if (existingLike) {
    await prismaClient.productLike.delete({ where: { id: existingLike.id } });
    return res.send({ isLiked: false });
  }

  // 3. 없다면 생성 (좋아요 추가)
  await prismaClient.productLike.create({
    data: { userId, productId },
  });
  return res.status(201).send({ isLiked: true });
}

// ## 유저가 좋아요를 표시한 상품 목록 조회
export async function getLikedProducts(req, res) {
  const userId = req.user.id;

  // ProductLike 테이블에서 내가 누른 것을 찾고 product 정보를 포함(include)
  const likedRecords = await prismaClient.productLike.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { createdAt: 'desc' },
  });

  // 클라이언트가 보기 편하게 product 객체 배열로 변환하여 전달
  const list = likedRecords.map((record) => record.product);
  return res.send({ list });
}
