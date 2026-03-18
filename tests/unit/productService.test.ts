// @ts-nocheck
import { jest } from "@jest/globals";

// repository mock 함수들
const createProductMock = jest.fn();
const findProductByIdMock = jest.fn();
const updateProductByIdMock = jest.fn();
const deleteProductByIdMock = jest.fn();
const findProductsMock = jest.fn();
const createProductCommentMock = jest.fn();
const findProductCommentsCursorMock = jest.fn();

// prisma mock 함수
const findManyMock = jest.fn();

// ESM module mock - repository
jest.unstable_mockModule("../../src/repositories/product.repository.js", () => ({
  createProduct: createProductMock,
  findProductById: findProductByIdMock,
  updateProductById: updateProductByIdMock,
  deleteProductById: deleteProductByIdMock,
  findProducts: findProductsMock,
  createProductComment: createProductCommentMock,
  findProductCommentsCursor: findProductCommentsCursorMock,
}));

// ESM module mock - prisma
jest.unstable_mockModule("../../prisma/prisma.js", () => ({
  prisma: {
    productLike: {
      findMany: findManyMock,
    },
  },
}));

// mock 이후 import
const productService = await import("../../src/services/productService.js");

describe("Product Service Unit Test", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 상품 생성
  describe("createProduct", () => {
    it("repository.createProduct를 호출한다", async () => {
      const dto = {
        userId: 1n,
        name: "테스트 상품",
        price: 10000,
        description: "상품 설명",
        tags: ["test"],
      };

      const mockEntity = {
        id: 1n,
        user_id: 1n,
        name: "테스트 상품",
        price: 10000,
        description: "상품 설명",
        tags: ["test"],
      };

      createProductMock.mockResolvedValue(mockEntity);

      const result = await productService.createProduct(dto);

      expect(createProductMock).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockEntity);
    });
  });

  // 상품 상세 조회
  describe("getProductById", () => {
    it("repository.findProductById를 호출한다", async () => {
      const dto = {
        id: 1n,
        userId: 2n,
      };

      const mockEntity = {
        id: 1n,
        name: "테스트 상품",
        likes: [{ id: 10n }],
      };

      findProductByIdMock.mockResolvedValue(mockEntity);

      const result = await productService.getProductById(dto);

      expect(findProductByIdMock).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockEntity);
    });
  });

  // 상품 수정
  describe("updateProduct", () => {
    it("id와 data를 분리해서 repository.updateProductById를 호출한다", async () => {
      const dto = {
        id: 1n,
        name: "수정된 상품명",
        price: 20000,
        description: "수정된 설명",
        tags: ["updated"],
      };

      const mockEntity = {
        id: 1n,
        name: "수정된 상품명",
        price: 20000,
        description: "수정된 설명",
        tags: ["updated"],
      };

      updateProductByIdMock.mockResolvedValue(mockEntity);

      const result = await productService.updateProduct(dto);

      expect(updateProductByIdMock).toHaveBeenCalledWith({
        id: 1n,
        data: {
          name: "수정된 상품명",
          price: 20000,
          description: "수정된 설명",
          tags: ["updated"],
        },
      });
      expect(result).toEqual(mockEntity);
    });
  });

  // 상품 삭제
  describe("deleteProduct", () => {
    it("repository.deleteProductById를 호출한다", async () => {
      const dto = { id: 1n };
      const mockEntity = { id: 1n };

      deleteProductByIdMock.mockResolvedValue(mockEntity);

      const result = await productService.deleteProduct(dto);

      expect(deleteProductByIdMock).toHaveBeenCalledWith(1n);
      expect(result).toEqual(mockEntity);
    });
  });

  // 상품 목록 조회
  describe("listProducts", () => {
    it("limit / offset 기본값을 적용해서 repository.findProducts를 호출한다", async () => {
      const dto = {
        userId: null,
      };

      const mockEntities = [{ id: 1n, name: "상품1" }];

      findProductsMock.mockResolvedValue(mockEntities);

      const result = await productService.listProducts(dto as never);

      expect(findProductsMock).toHaveBeenCalledWith({
        take: 3,
        skip: 0,
        sort: undefined,
        search: undefined,
        userId: null,
      });
      expect(result).toEqual(mockEntities);
    });

    it("전달된 limit / offset / sort / search 값을 repository.findProducts에 넘긴다", async () => {
      const dto = {
        limit: 5,
        offset: 10,
        sort: "recent",
        search: "키워드",
        userId: 1n,
      };

      const mockEntities = [{ id: 2n, name: "검색된 상품" }];

      findProductsMock.mockResolvedValue(mockEntities);

      const result = await productService.listProducts(dto as never);

      expect(findProductsMock).toHaveBeenCalledWith({
        take: 5,
        skip: 10,
        sort: "recent",
        search: "키워드",
        userId: 1n,
      });
      expect(result).toEqual(mockEntities);
    });
  });

  // 상품 댓글 cursor 조회
  describe("listProductCommentsCursor", () => {
    it("limit 기본값 10을 적용해서 repository.findProductCommentsCursor를 호출한다", async () => {
      const dto = {
        productId: 1n,
      };

      const mockResult = {
        entities: [{ id: 3n, content: "댓글" }],
        nextCursorId: "3",
      };

      findProductCommentsCursorMock.mockResolvedValue(mockResult);

      const result = await productService.listProductCommentsCursor(dto as never);

      expect(findProductCommentsCursorMock).toHaveBeenCalledWith({
        productId: 1n,
        take: 10,
        cursorId: undefined,
      });
      expect(result).toEqual(mockResult);
    });

    it("전달된 limit / cursorId를 repository.findProductCommentsCursor에 넘긴다", async () => {
      const dto = {
        productId: 1n,
        limit: 20,
        cursorId: 99n,
      };

      const mockResult = {
        entities: [],
        nextCursorId: null,
      };

      findProductCommentsCursorMock.mockResolvedValue(mockResult);

      const result = await productService.listProductCommentsCursor(dto as never);

      expect(findProductCommentsCursorMock).toHaveBeenCalledWith({
        productId: 1n,
        take: 20,
        cursorId: 99n,
      });
      expect(result).toEqual(mockResult);
    });
  });

  // 상품 좋아요 유저 목록 조회
  describe("getProductLikeUserIds", () => {
    it("prisma.productLike.findMany 결과를 user_id 배열로 반환한다", async () => {
      findManyMock.mockResolvedValue([
        { user_id: 11n },
        { user_id: 22n },
      ]);

      const result = await productService.getProductLikeUserIds(1n);

      expect(findManyMock).toHaveBeenCalledWith({
        where: { product_id: 1n },
        select: { user_id: true },
      });
      expect(result).toEqual([11n, 22n]);
    });
  });
});