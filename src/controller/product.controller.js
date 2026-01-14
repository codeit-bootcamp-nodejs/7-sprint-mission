import prisma from '../../prisma/prisma.js';
import { ProductList, ProductDetail } from '../model/product.model.js';
import { NotFoundError } from '../errors/notFoundError.js';
import { ValidationError } from '../errors/validationError.js';
import { cursorPaginationOption } from '../utils/cursorPagination.js';
import { ForbiddenError } from '../errors/forbiddenError.js';

function getFindOption(req) {
  const page = Math.max(Number(req.query.page ?? 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit ?? 10), 1), 50);

  const skip = (page - 1) * limit;
  const keyword = req.query.keyword;

  const findOption = {
    take: limit,
    skip,
    orderBy: { createdAt: 'desc' },
  };

  if (keyword) {
    const searchFilter = {
      contains: keyword,
      mode: 'insensitive',
    };

    findOption.where = {
      OR: [{ name: searchFilter }, { description: searchFilter }],
    };
  }

  return { findOption, page, limit };
}

export const productGet = async function (req, res, next) {
  try {
    const userId = req.user ? BigInt(req.user.userId) : null;

    const { findOption, page, limit } = getFindOption(req);
    const [entities, totalCount] = await Promise.all([
      prisma.product.findMany({
        ...findOption,
        include: {
          likes: userId ? { where: { userId }, select: { id: true } } : false,
        },
      }),
      prisma.product.count({
        where: findOption.where,
      }),
    ]);

    const products = entities.map((entity) => ({
      ...ProductList.fromEntity(entity),
      isLiked: userId ? entity.likes.length > 0 : false,
    }));

    res.status(200).json({
      message: 'product list 조회 성공',
      data: products,
      meta: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

export const productFindGet = async function (req, res, next) {
  try {
    const productId = BigInt(req.params.productId);
    const userId = req.user ? BigInt(req.user.userId) : null;

    const entity = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        likes: userId ? { where: { userId }, select: { id: true } } : false,
      },
    });

    if (!entity) {
      throw new NotFoundError('상품을 찾을 수 없습니다.');
    }

    const isLiked = userId ? entity.likes.length > 0 : false;

    const product = ProductDetail.fromEntity(entity);
    res.status(200).json({ message: 'product 상세조회 성공', data: { ...product, isLiked } });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const productCreate = async function (req, res, next) {
  try {
    const { name, description, price, tags } = req.body;
    const userId = req.user.userId;
    const createEntity = await prisma.product.create({
      data: {
        name,
        description,
        price,
        tags,
        userId: BigInt(userId),
      },
    });
    const product = ProductDetail.fromEntity(createEntity);

    res.status(201).json({ message: 'product 생성 성공', data: product });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const productUpdate = async function (req, res, next) {
  try {
    const productId = BigInt(req.params.productId);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError('상품을 찾을 수 없습니다.');
    }

    if (product.userId !== BigInt(req.user.userId)) {
      throw new ForbiddenError('유저 아이디가 일치하지 않습니다.');
    }

    const { name, description, price, tags } = req.body;

    const updateEntity = await prisma.product.update({
      where: { id: BigInt(productId) },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price }),
        ...(tags !== undefined && { tags }),
      },
    });

    const updateProduct = ProductDetail.fromEntity(updateEntity);
    res.status(200).json({ message: 'product가 수정 되었습니다.', data: updateProduct });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const productDelete = async function (req, res, next) {
  try {
    const productId = BigInt(req.params.productId);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError('상품을 찾을 수 없습니다.');
    }

    if (product.userId !== BigInt(req.user.userId)) {
      throw new ForbiddenError('유저 아이디가 일치하지 않습니다.');
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    res.status(204).end();
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const createProductComment = async (req, res, next) => {
  try {
    const productId = BigInt(req.params.productId);
    const { content } = req.body;
    const userId = req.user.userId;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError('해당 상품을 찾을 수 없습니다.');
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        productId,
        userId: BigInt(userId),
      },
    });
    res.status(201).json({
      message: '댓글 등록 성공',
      data: {
        id: comment.id.toString(),
        content: comment.content,
        createdAt: comment.createdAt,
      },
    });
  } catch (e) {
    next(e);
  }
};

export const getProductComment = async (req, res, next) => {
  try {
    const productId = BigInt(req.params.productId);

    const cursor = req.query.cursor;
    const limit = Number(req.query.limit ?? 10);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError('해당 상품을 찾을 수 없습니다.');
    }

    const comments = await prisma.comment.findMany(
      cursorPaginationOption({
        cursor,
        limit,
        where: { productId },
      }),
    );

    const nextCursor = comments.length > 0 ? comments[comments.length - 1].id.toString() : null;

    res.status(200).json({
      data: comments.map((c) => ({
        id: c.id.toString(),
        content: c.content,
        createdAt: c.createdAt,
      })),
      nextCursor,
    });
  } catch (e) {
    next(e);
  }
};

export const uploadProductImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ValidationError('이미지 파일이 필요합니다.');
    }

    const imagePath = `/uploads/product/${req.file.filename}`;

    res.status(201).json({
      message: '이미지 업로드 성공',
      imageUrl: imagePath,
    });
  } catch (e) {
    next(e);
  }
};
