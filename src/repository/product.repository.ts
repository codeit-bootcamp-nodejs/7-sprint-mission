import prisma from '../../prisma/prisma';
import type { Prisma } from '@prisma/client';
import type { CreateProductDto, UpdateProductDto } from '../types/product.type';
import { cursorPaginationOption } from '../utils/cursorPagination';

interface FindOption {
  skip: number;
  take: number;
  orderBy: Prisma.ProductOrderByWithRelationInput;
  where?: Prisma.ProductWhereInput;
}

export class ProductRepo {
  /**
   * 상품 존재 여부 확인
   * @param productId - 상품 ID
   * @returns 상품이 존재하면 해당 상품 객체 반환
   */
  findDetailProduct = async (productId: bigint) => {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    return product;
  };

  // 페이지네이션 및 검색어에 따른 조회 옵션 생성
  getFindOption = (page: number, limit: number, keyword: string | undefined) => {
    const skip = (page - 1) * limit;

    const findOption: FindOption = {
      take: limit,
      skip,
      orderBy: { createdAt: 'desc' },
    };

    if (keyword) {
      const searchFilter: Prisma.StringFilter = {
        contains: keyword,
        mode: 'insensitive',
      };

      findOption.where = {
        OR: [{ name: searchFilter }, { description: searchFilter }],
      };
    }

    return findOption;
  };

  /**
   * 상품 목록 조회 리포지토리
   * @param page - 페이지 번호
   * @param limit - 페이지당 게시글 수
   * @param keyword - 검색 키워드 (제목 또는 내용에 포함된 경우)
   * @param userId - 로그인한 유저의 ID (좋아요 여부 판단을 위해 사용)
   * @returns 상품 목록 및 전체 상품 수
   */
  getProductList = async (
    limit: number,
    page: number,
    keyword: string | undefined,
    userId: bigint | null,
  ) => {
    const findOption = this.getFindOption(page, limit, keyword);

    const [entities, totalCount] = await Promise.all([
      prisma.product.findMany({
        ...findOption,
        include: {
          likes: userId ? { where: { userId }, select: { id: true } } : false,
        },
      }),
      prisma.product.count({ where: findOption.where ?? {} }),
    ]);

    return { entities, totalCount };
  };

  /**
   * 상품 상세 조회 리포지토리
   * @param productId - 상품 ID
   * @param userId - 로그인한 유저의 ID (좋아요 여부 판단을 위해 사용)
   * @returns 상품 상세 정보
   */
  getProductDetail = async (productId: bigint, userId: bigint | null) => {
    const entity = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        likes: userId ? { where: { userId }, select: { id: true } } : false,
      },
    });

    return entity;
  };

  /**
   * 상품 생성 리포지토리
   * @param userId - 상품 작성자 ID
   * @param dto - 상품 생성 DTO
   * @returns 생성된 상품 엔티티
   */
  createProduct = async (userId: bigint, dto: CreateProductDto) => {
    const { name, description, price, tags } = dto;

    const createEntity = await prisma.product.create({
      data: {
        userId,
        name,
        description,
        price,
        tags,
      },
    });
    return createEntity;
  };

  /**
   * 상품 수정 리포지토리
   * @param productId - 수정할 상품 ID
   * @param dto - 상품 수정 DTO
   * @returns 수정된 상품 엔티티
   */
  updateProduct = async (productId: bigint, dto: UpdateProductDto) => {
    const { name, description, price, tags, images } = dto;

    const updateData: Prisma.ProductUpdateInput = {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price }),
      ...(tags !== undefined && { tags: { set: tags! } }),
      ...(images !== undefined && { images: { set: images! } }),
    };

    const updatedEntity = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    return updatedEntity;
  };

  /**
   * 상품 삭제 리포지토리
   * @param productId - 삭제할 상품 ID
   * @returns 삭제 성공 시 반환값 없음
   */
  deleteProduct = async (productId: bigint): Promise<void> => {
    await prisma.product.delete({
      where: { id: productId },
    });
  };

  /**
   * 상품 댓글 생성 리포지토리
   * @param productId - 상품 ID
   * @param userId - 유저 ID
   * @param dto - 댓글 생성 DTO
   * @returns 생성된 댓글 엔티티
   */
  createProductComment = async (userId: bigint, productId: bigint, content: string) => {
    const comment = await prisma.comment.create({
      data: {
        content,
        productId,
        userId: userId,
      },
    });

    return comment;
  };

  /**
   * 상품 댓글 조회 리포지토리
   * @param productId - 상품 ID
   * @param limit - 페이지당 댓글 수
   * @param cursor - 커서 (이전 요청에서 받은 다음 커서)
   * @returns 댓글 목록
   */
  getProductComment = async (productId: bigint, limit: number, cursor: bigint | undefined) => {
    const entities = await prisma.comment.findMany(
      cursorPaginationOption({
        cursor,
        limit: limit + 1,
        where: { productId },
      }),
    );

    return entities;
  };
}
