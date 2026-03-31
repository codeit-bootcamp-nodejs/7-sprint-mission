import { ProductList, ProductDetail } from '../model/product.model';
import Comment from '../model/comment.model';
import { NotFoundError } from '../errors/notFoundError';
import { ForbiddenError } from '../errors/forbiddenError';
import type { CreateProductDto, UpdateProductDto } from '../types/product.type';
import { ProductRepo } from '../repository/product.repository';
import { eventEmitter } from '../event';

export class ProductService {
  private productRepo = new ProductRepo();

  // 상품 소유자 검증
  validateOwner = async (productId: bigint, userId: bigint) => {
    const product = await this.productRepo.findDetailProduct(productId);
    if (!product) throw new NotFoundError('상품을 찾을 수 없습니다.');
    if (product.userId !== userId) throw new ForbiddenError('권한이 없습니다.');
  };

  /**
   * 상품 목록 조회 서비스
   * @param page - 페이지 번호 (기본값: 1)
   * @param limit - 페이지당 게시글 수 (기본값: 10, 최대값: 50)
   * @param keyword - 검색 키워드 (제목 또는 내용에 포함된 경우)
   * @param userId - 로그인한 유저의 ID (좋아요 여부 판단을 위해 사용)
   * @returns 상품 목록과 전체 게시글 수
   * @description
   * 1. 페이지네이션과 키워드 검색을 지원합니다.
   * 2. 로그인한 유저가 좋아요한 상품인지 여부를 함께 반환합니다.
   */
  getProductList = async (
    limit: number,
    page: number,
    userId: bigint | null,
    keyword: string | undefined,
  ) => {
    const { entities, totalCount } = await this.productRepo.getProductList(
      limit,
      page,
      keyword,
      userId,
    );

    const products = entities.map((entity) => ({
      ...ProductList.fromEntity(entity),
      isLiked: userId ? (entity.likes.length ?? 0) > 0 : false,
    }));

    return { products, totalCount };
  };

  /**
   * 상품 상세 조회 서비스
   * @param productId - 상품 ID
   * @param userId - 로그인한 유저의 ID (좋아요 여부 판단을 위해 사용)
   * @returns 상품 상세 정보
   * @desctiption
   * 1. 상품 ID로 게시글을 조회하며, 존재하지 않을 경우 NotFoundError를 던집니다.
   * 2. 로그인한 유저가 좋아요한 상품인지 여부를 함께 반환합니다.
   */
  getProductDetail = async (productId: bigint, userId: bigint | null) => {
    const entity = await this.productRepo.getProductDetail(productId, userId);

    if (!entity) {
      throw new NotFoundError('상품을 찾을 수 없습니다.');
    }

    const isLiked = userId ? (entity.likes.length ?? 0) > 0 : false;
    const product = ProductDetail.fromEntity(entity);

    return { ...product, isLiked };
  };

  /**
   * 상품 생성 서비스
   * @param dto - 상품 생성 DTO
   * @param userId - 유저 ID
   * @returns 생성된 상품 정보
   * @description 로그인한 유저가 상품을 작성할 수 있도록 하며, 생성된 상품 정보를 반환합니다.
   */
  createProduct = async (userId: bigint, dto: CreateProductDto) => {
    const createEntity = await this.productRepo.createProduct(userId, dto);
    const product = ProductDetail.fromEntity(createEntity);

    return product;
  };

  /**
   * 상품 수정 서비스
   * @param {bigint} productId - 상품 ID
   * @param {bigint} userId - 유저 ID
   * @param {UpdateProductDto} dto - 상품 수정 DTO
   * @returns {Promise<Article>} 수정된 상품 정보
   * @description 로그인한 유저가 본인의 상품만 수정할 수 있도록 하며, 수정된 상품 정보를 반환합니다.
   */
  updateProduct = async (productId: bigint, userId: bigint, dto: UpdateProductDto) => {
    // 검증로직 검사
    await this.validateOwner(productId, userId);

    const updatedEntity = await this.productRepo.updateProduct(productId, dto);

    if (dto.price !== undefined) {
      eventEmitter.emit('productPriceChanged', {
        product: {
          productId: updatedEntity.id,
          name: updatedEntity.name,
          price: updatedEntity.price,
        },
      });
    }

    return ProductDetail.fromEntity(updatedEntity);
  };

  /**
   * 상품 삭제 서비스
   * @param productId - 상품 ID
   * @param userId - 유저 ID
   * @returns 삭제 성공시 반환값 없음
   * @description 로그인한 유저가 본인의 상품만 삭제할 수 있도록 하며, 성공 시 리턴값 없음
   */
  deleteProduct = async (productId: bigint, userId: bigint): Promise<void> => {
    await this.validateOwner(productId, userId);

    await this.productRepo.deleteProduct(productId);
  };

  /**
   * 상품 댓글 작성 서비스
   * @param productId - 상품 ID
   * @param userId - 유저 ID
   * @param dto - 댓글 생성 DTO
   * @returns 생성된 댓글 정보
   * @description 로그인한 유저가 상품에 댓글을 작성할 수 있도록 하며, 생성된 댓글 정보를 반환합니다.
   */
  createProductComment = async (productId: bigint, userId: bigint, content: string) => {
    const product = await this.productRepo.findDetailProduct(productId);
    if (!product) throw new NotFoundError('해당 상품을 찾을 수 없습니다.');

    const comment = await this.productRepo.createProductComment(userId, productId, content);

    if (product.userId !== userId) {
      eventEmitter.emit('productCommentCreated', { product, productId });
    }

    return Comment.fromEntity(comment);
  };

  /**
   * 상품 댓글 목록 조회 서비스
   * @param productId -  상품 ID
   * @param cursor - 커서 (이전 요청에서 받은 다음 커서)
   * @param limit - 한 번에 조회할 댓글 수
   * @returns 댓글 목록과 다음 커서 정보
   */
  getProductComment = async (productId: bigint, limit: number, cursor?: bigint | undefined) => {
    const product = await this.productRepo.findDetailProduct(productId);

    if (!product) throw new NotFoundError('해당 상품을 찾을 수 없습니다.');

    const entities = await this.productRepo.getProductComment(productId, limit, cursor);

    const hasNextPage = entities.length > limit;

    const commentsToReturn = hasNextPage ? entities.slice(0, limit) : entities;

    const nextCursor = hasNextPage
      ? commentsToReturn[commentsToReturn.length - 1]?.id.toString()
      : null;

    const comments = commentsToReturn.map((c) => Comment.fromEntity(c));
    return { comments, nextCursor };
  };
}
