import type { Request, Response, NextFunction } from 'express';
import {
  getProductDetailService,
  getProductService,
  createProductService,
  updateProductService,
  deleteProductService,
  createProductCommentService,
  getProductCommentService,
} from '../service/product.service';
import { ValidationError } from '../errors/validationError';
import type { CreateProductDto, UpdateProductDto } from '../types/product.type';
import type { CommentDto } from '../types/comment.type';
import type { ProductParams } from '../types/product.type';

// 상품 목록 조회 컨트롤러
export const productGet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(Number(req.query.page ?? 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit ?? 10), 1), 50);
    const userId = req.user ? BigInt(req.user.userId) : null;
    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword : undefined;

    const { products, totalCount } = await getProductService(limit, page, userId, keyword);

    res.status(200).json({
      message: '상품 목록 조회를 성공하였습니다.',
      data: products,
      meta: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (e) {
    next(e);
  }
};

// 상품 상세 조회 컨트롤러
export const productFindGet = async function (
  req: Request<ProductParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const productId = BigInt(req.params.productId);
    const userId = req.user ? BigInt(req.user.userId) : null;

    const product = await getProductDetailService(productId, userId);

    res.status(200).json({ message: '상품 상세조회를 성공하였습니다.', data: product });
  } catch (e) {
    next(e);
  }
};

// 상품 등록 컨트롤러
export const productCreate = async function (
  req: Request<{}, {}, CreateProductDto>,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = BigInt(req.user!.userId);
    const nickname = req.user!.nickname;
    const product = await createProductService(userId, req.body);

    res
      .status(201)
      .json({ message: `${nickname}님, 상품이 성공적으로 등록되었습니다.`, data: product });
  } catch (e) {
    next(e);
  }
};

// 상품 수정 컨트롤러
export const productUpdate = async function (
  req: Request<ProductParams, {}, UpdateProductDto>,
  res: Response,
  next: NextFunction,
) {
  try {
    const productId = BigInt(req.params.productId);
    const userId = BigInt(req.user!.userId);
    const nickname = req.user!.nickname;
    const updateDto: UpdateProductDto = {
      ...req.body,
      ...(req.file && { image: `/uploads/product/${req.file.filename}` }),
    };

    const updateProduct = await updateProductService(productId, userId, updateDto);

    res.status(200).json({
      message: `${nickname}님, 상품 정보가 성공적으로 수정되었습니다.`,
      data: updateProduct,
    });
  } catch (e) {
    next(e);
  }
};

// 상품 삭제 컨트롤러
export const productDelete = async function (
  req: Request<ProductParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const productId = BigInt(req.params.productId);
    const userId = BigInt(req.user!.userId);

    await deleteProductService(productId, userId);

    res.status(204).end();
  } catch (e) {
    console.error(e);
    next(e);
  }
};

// 상품 댓글 등록 컨틀롤러
export const createProductComment = async (
  req: Request<ProductParams, {}, CommentDto>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productId = BigInt(req.params.productId);
    const { content } = req.body;
    const userId = BigInt(req.user!.userId);
    const nickname = req.user!.nickname;

    const comment = await createProductCommentService(productId, userId, content);

    res.status(201).json({
      message: `${nickname}님의 댓글이 등록되었습니다.`,
      data: comment,
    });
  } catch (e) {
    next(e);
  }
};

//상품 댓글 조회 컨트롤러
export const getProductComment = async (
  req: Request<ProductParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productId = BigInt(req.params.productId);
    const cursorRaw = req.query.cursor;
    const limit = Number(req.query.limit ?? 10);

    const cursor = typeof cursorRaw === 'string' ? BigInt(cursorRaw) : undefined;

    const { comments, nextCursor } = await getProductCommentService(productId, limit, cursor);

    res.status(200).json({
      data: { comments, nextCursor },
    });
  } catch (e) {
    next(e);
  }
};

export const uploadProductImage = async (req: Request, res: Response, next: NextFunction) => {
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
