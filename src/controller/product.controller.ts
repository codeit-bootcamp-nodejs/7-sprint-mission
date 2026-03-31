import type { Request, Response, NextFunction } from 'express';
import { ProductService } from '../service/product.service';
import { ValidationError } from '../errors/validationError';
import type { CreateProductDto, UpdateProductDto } from '../types/product.type';
import type { CommentDto } from '../types/comment.type';
import type { ProductParams } from '../types/product.type';

export class ProductController {
  private productService = new ProductService();

  /**
   * 상품 목록 조회 컨트롤러
   * @param {Request} req - 요청 객체 (query: page, limit, keyword)
   * @param {Response} res - 응답 객체 (products: 게시글 목록, meta 데이터 변환)
   * @param {NextFunction} next - 에러 핸들러로 넘기기 위한 함수
   * @description
   * 1. 페이지네이션과 키워드 검색을 지원
   * 2. 로그인 시 본인이 좋아요한 게시글 여부를 판단합니다.
   */
  getProductList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(Number(req.query.page ?? 1), 1);
      const limit = Math.min(Math.max(Number(req.query.limit ?? 10), 1), 50);
      const userId = req.user ? BigInt(req.user.userId) : null;
      const keyword = typeof req.query.keyword === 'string' ? req.query.keyword : undefined;

      const { products, totalCount } = await this.productService.getProductList(
        limit,
        page,
        userId,
        keyword,
      );

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

  /**
   * 상품 상세 조회 컨트롤러
   * @param {Request} req - 요청 객체 (params: productId, user: 로그인정보)
   * @param {Response} res - 응답 객체 (product: 게시글 상세 정보)
   * @param {NextFunction} next - 에러 핸들러로 넘기기 위한 함수
   * @description
   * 1. URL 파라미터의 productId를 BigInt로 변환하여 조회합니다.
   * 2. 로그인 한 유저는 본인이 좋아요 누른 게시글인지 여부를 함께 반환합니다.
   */
  getProductDetail = async (req: Request<ProductParams>, res: Response, next: NextFunction) => {
    try {
      const productId = BigInt(req.params.productId);
      const userId = req.user ? BigInt(req.user.userId) : null;

      const product = await this.productService.getProductDetail(productId, userId);

      res.status(200).json({ message: '상품 상세조회를 성공하였습니다.', data: product });
    } catch (e) {
      next(e);
    }
  };

  /**
   * 상품 작성 컨트롤러
   * @param {Request} req - 요청 객체 (body: CreateProductDto, user: 로그인 정보)
   * @param {Response} res - 응답 객체 (message: 성공 메세지, data: 작성된 게시글 정보)
   * @param {NextFunction} next - 에러 핸들러로 넘기기 위한 함수
   * @description 로그인한 유저가 상품을 등록할 수 있도록 하며, 작성된 상품 정보를 반환합니다.
   */
  createProduct = async (
    req: Request<{}, {}, CreateProductDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = BigInt(req.user!.userId);
      const nickname = req.user!.nickname;
      const product = await this.productService.createProduct(userId, req.body);

      res
        .status(201)
        .json({ message: `${nickname}님, 상품이 성공적으로 등록되었습니다.`, data: product });
    } catch (e) {
      next(e);
    }
  };

  /**
   * 상품 수정 컨트롤러
   * @param {Request} req - 요청 객체 (params: productId, body: UpdateProductDto, user: 로그인 정보)
   * @param {Response} res - 응답 객체 (message: 성공 메세지, data: 수정된 게시글 정보)
   * @param {NextFunction} next - 에러 핸들러로 넘기기 위한 함수
   * @description 로그인한 유저가 본인의 상품만 수정할 수 있도록 하며, 수정된 상품 정보를 반환합니다.
   */
  productUpdate = async (
    req: Request<ProductParams, {}, UpdateProductDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const productId = BigInt(req.params.productId);
      const userId = BigInt(req.user!.userId);
      const nickname = req.user!.nickname;
      const updateDto: UpdateProductDto = {
        ...req.body,
        ...(req.file && { image: `/uploads/product/${req.file.filename}` }),
      };

      const updateProduct = await this.productService.updateProduct(productId, userId, updateDto);

      res.status(200).json({
        message: `${nickname}님, 상품 정보가 성공적으로 수정되었습니다.`,
        data: updateProduct,
      });
    } catch (e) {
      next(e);
    }
  };

  /**
   * 상품 삭제 컨트롤러
   * @param {Request} req - 요청 객체 (params: productId, user: 로그인 정보)
   * @param {Response} res - 응답 객체 (message: 성공 메세지)
   * @param {NextFunction} next - 에러 핸들러로 넘기기 위한 함수
   * @description 로그인한 유저가 본인의 상품만 삭제할 수 있도록 하며, 성공 시 204 No Content 상태 코드를 반환합니다.
   */
  productDelete = async (req: Request<ProductParams>, res: Response, next: NextFunction) => {
    try {
      const productId = BigInt(req.params.productId);
      const userId = BigInt(req.user!.userId);

      await this.productService.deleteProduct(productId, userId);

      res.status(204).end();
    } catch (e) {
      console.error(e);
      next(e);
    }
  };

  /**
   * 상품 댓글 작성 컨트롤러
   * @param {Request} req - 요청 객체 (params: productId, body: CommentDto, user: 로그인 정보)
   * @param {Response} res - 응답 객체 (message: 성공 메세지, data: 작성된 댓글 정보)
   * @param {NextFunction} next - 에러 핸들러로 넘기기 위한 함수
   * @description 로그인한 유저가 게시글에 댓글을 작성할 수 있도록 하며, 작성된 댓글 정보를 반환합니다.
   */
  createProductComment = async (
    req: Request<ProductParams, {}, CommentDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const productId = BigInt(req.params.productId);
      const { content } = req.body;
      const userId = BigInt(req.user!.userId);
      const nickname = req.user!.nickname;

      const comment = await this.productService.createProductComment(productId, userId, content);

      res.status(201).json({
        message: `${nickname}님의 댓글이 등록되었습니다.`,
        data: comment,
      });
    } catch (e) {
      next(e);
    }
  };

  /**
   * 상품 댓글 목록 조회 컨트롤러
   * @param {Request} req - 요청 객체 (params: productId, query: cursor, limit)
   * @param {Response} res - 응답 객체 (data: 댓글 목록, nextCursor: 다음 커서)
   * @param {NextFunction} next - 에러 핸들러로 넘기기 위한 함수
   * @description 로그인한 유저가 상품의 댓글 목록을 조회할 수 있도록 하며, 페이지네이션을 지원합니다.
   */
  getProductComment = async (req: Request<ProductParams>, res: Response, next: NextFunction) => {
    try {
      const productId = BigInt(req.params.productId);
      const cursorRaw = req.query.cursor;
      const limit = Number(req.query.limit ?? 10);

      const cursor = typeof cursorRaw === 'string' ? BigInt(cursorRaw) : undefined;

      const { comments, nextCursor } = await this.productService.getProductComment(
        productId,
        limit,
        cursor,
      );

      res.status(200).json({
        data: { comments, nextCursor },
      });
    } catch (e) {
      next(e);
    }
  };

  /**
   * 상품 이미지 업로드 컨트롤러
   * @param {Request} req - 요청 객체 (file: 업로드된 이미지 파일)
   * @param {Response} res - 응답 객체 (imageUrl: 저장된 이미지 경로)
   * @param {NextFunction} next - 에러 핸들러로 넘기기 위한 함수
   * @description Multer를 통해 업로드된 파일의 경로를 생성하여 클라이언트에 반환합니다.
   */
  uploadProductImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file as Express.MulterS3.File;

      if (!file) {
        throw new ValidationError('이미지 파일이 필요합니다.');
      }

      const imagePath = file.location;

      res.status(201).json({
        message: '이미지 업로드 성공',
        imageUrl: imagePath,
      });
    } catch (e) {
      next(e);
    }
  };
}
