jest.mock('../repositories/productsRepository');
jest.mock('../repositories/favoritesRepository');
jest.mock('../services/notificationsService');

import * as productsService from '../services/productsService';
import * as productsRepository from '../repositories/productsRepository';
import * as favoritesRepository from '../repositories/favoritesRepository';
import * as notificationsService from '../services/notificationsService';
import NotFoundError from '../lib/errors/NotFoundError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import { NotificationType } from '../types/Notification';

// Mock 타입 단축어
const mockProductsRepo = productsRepository as jest.Mocked<typeof productsRepository>;
const mockFavoritesRepo = favoritesRepository as jest.Mocked<typeof favoritesRepository>;
const mockNotificationsService = notificationsService as jest.Mocked<typeof notificationsService>;

// 공통 픽스처
const baseProduct = {
  id: 1,
  name: '테스트 상품',
  description: '테스트 설명',
  price: 10000,
  tags: ['tag1'],
  images: [] as string[],
  userId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productWithFavorites = {
  ...baseProduct,
  favorites: undefined,
  favoriteCount: 2,
  isFavorited: false,
};

beforeEach(() => {
  jest.clearAllMocks(); // 각 테스트 전에 Mock 호출 기록 초기화
});

// ── createProduct ────────────────────────────────────
describe('productsService.createProduct()', () => {
  it('repository를 호출하고 favoriteCount:0, isFavorited:false를 붙여 반환한다', async () => {
    mockProductsRepo.createProduct.mockResolvedValue(baseProduct);

    const result = await productsService.createProduct({
      name: '새 상품',
      description: '설명',
      price: 5000,
      tags: [],
      images: [],
      userId: 1,
    });

    expect(mockProductsRepo.createProduct).toHaveBeenCalledTimes(1);
    expect(result.favoriteCount).toBe(0);
    expect(result.isFavorited).toBe(false);
  });
});

// ── getProduct ───────────────────────────────────────
describe('productsService.getProduct()', () => {
  it('존재하는 상품을 반환한다', async () => {
    mockProductsRepo.getProductWithFavorites.mockResolvedValue(productWithFavorites);

    const result = await productsService.getProduct(1);

    expect(mockProductsRepo.getProductWithFavorites).toHaveBeenCalledWith(1);
    expect(result).toEqual(productWithFavorites);
  });

  it('상품이 없으면 NotFoundError를 던진다', async () => {
    mockProductsRepo.getProductWithFavorites.mockResolvedValue(null);

    await expect(productsService.getProduct(999)).rejects.toThrow(NotFoundError);
  });
});

// ── updateProduct ────────────────────────────────────
describe('productsService.updateProduct()', () => {
  it('소유자가 상품을 정상적으로 수정한다', async () => {
    mockProductsRepo.getProduct.mockResolvedValue(baseProduct);
    mockProductsRepo.updateProductWithFavorites.mockResolvedValue({
      ...productWithFavorites,
      name: '수정된 상품',
      price: 15000,
    });
    mockFavoritesRepo.getFavoritesByProductId.mockResolvedValue([]);

    const result = await productsService.updateProduct(1, {
      name: '수정된 상품',
      price: 15000,
      userId: 1,
    });

    expect(result.name).toBe('수정된 상품');
    expect(result.price).toBe(15000);
    expect(mockProductsRepo.updateProductWithFavorites).toHaveBeenCalledTimes(1);
  });

  it('소유자가 아닌 유저가 수정하면 ForbiddenError를 던진다', async () => {
    mockProductsRepo.getProduct.mockResolvedValue(baseProduct); // userId: 1

    await expect(
      productsService.updateProduct(1, {
        name: '탈취 수정',
        userId: 99, // 다른 유저
      }),
    ).rejects.toThrow(ForbiddenError);

    // 권한 없으면 update가 절대 호출되지 않아야 함
    expect(mockProductsRepo.updateProductWithFavorites).not.toHaveBeenCalled();
  });

  it('존재하지 않는 상품 수정 시 NotFoundError를 던진다', async () => {
    mockProductsRepo.getProduct.mockResolvedValue(null);

    await expect(
      productsService.updateProduct(999, { name: '없는 상품', userId: 1 }),
    ).rejects.toThrow(NotFoundError);
  });

  // ── 핵심: 가격 변경 알림 로직 ──────────────────────
  describe('가격 변경 알림', () => {
    it('가격이 변경되면 찜한 유저들에게 알림을 생성한다', async () => {
      const favorites = [
        { id: 1, productId: 1, userId: 10, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, productId: 1, userId: 20, createdAt: new Date(), updatedAt: new Date() },
      ];

      mockProductsRepo.getProduct.mockResolvedValue(baseProduct); // price: 10000
      mockProductsRepo.updateProductWithFavorites.mockResolvedValue({
        ...productWithFavorites,
        price: 8000, // 가격 변경
      });
      mockFavoritesRepo.getFavoritesByProductId.mockResolvedValue(favorites);
      mockNotificationsService.createNotifications.mockResolvedValue(undefined);

      const spy = jest.spyOn(notificationsService, 'createNotifications');

      await productsService.updateProduct(1, { price: 8000, userId: 1 });

      // 찜한 유저 2명에게 알림 생성됐는지 검증
      expect(spy).toHaveBeenCalledTimes(1);
      const calledWith = spy.mock.calls[0][0];
      expect(calledWith).toHaveLength(2);
      expect(calledWith[0]).toMatchObject({
        userId: 10,
        type: NotificationType.PRICE_CHANGED,
        payload: { productId: 1, price: 8000 },
      });
    });

    it('가격이 변경되지 않으면 알림을 생성하지 않는다', async () => {
      mockProductsRepo.getProduct.mockResolvedValue(baseProduct); // price: 10000
      mockProductsRepo.updateProductWithFavorites.mockResolvedValue({
        ...productWithFavorites,
        name: '이름만 변경',
        price: 10000, // 가격 동일
      });
      mockFavoritesRepo.getFavoritesByProductId.mockResolvedValue([]);

      const spy = jest.spyOn(notificationsService, 'createNotifications');

      await productsService.updateProduct(1, { name: '이름만 변경', userId: 1 });

      expect(spy).not.toHaveBeenCalled();
    });

    it('찜한 유저가 없으면 알림 배열이 비어있다', async () => {
      mockProductsRepo.getProduct.mockResolvedValue(baseProduct); // price: 10000
      mockProductsRepo.updateProductWithFavorites.mockResolvedValue({
        ...productWithFavorites,
        price: 5000, // 가격 변경
      });
      mockFavoritesRepo.getFavoritesByProductId.mockResolvedValue([]); // 찜 없음

      const spy = jest.spyOn(notificationsService, 'createNotifications');

      await productsService.updateProduct(1, { price: 5000, userId: 1 });

      const calledWith = spy.mock.calls[0]?.[0] ?? [];
      expect(calledWith).toHaveLength(0);
    });
  });
});

// ── deleteProduct ────────────────────────────────────
describe('productsService.deleteProduct()', () => {
  it('소유자가 상품을 정상적으로 삭제한다', async () => {
    mockProductsRepo.getProduct.mockResolvedValue(baseProduct);
    mockProductsRepo.deleteProduct.mockResolvedValue(baseProduct);

    await productsService.deleteProduct(1, 1);

    expect(mockProductsRepo.deleteProduct).toHaveBeenCalledWith(1);
  });

  it('소유자가 아닌 유저가 삭제하면 ForbiddenError를 던진다', async () => {
    mockProductsRepo.getProduct.mockResolvedValue(baseProduct); // userId: 1

    await expect(productsService.deleteProduct(1, 99)).rejects.toThrow(ForbiddenError);

    expect(mockProductsRepo.deleteProduct).not.toHaveBeenCalled();
  });

  it('존재하지 않는 상품 삭제 시 NotFoundError를 던진다', async () => {
    mockProductsRepo.getProduct.mockResolvedValue(null);

    await expect(productsService.deleteProduct(999, 1)).rejects.toThrow(NotFoundError);
  });
});

// ── getProductList ───────────────────────────────────
describe('productsService.getProductList()', () => {
  it('repository에서 받은 목록을 그대로 반환한다', async () => {
    const mockResult = {
      list: [productWithFavorites],
      totalCount: 1,
    };
    mockProductsRepo.getProductListWithFavorites.mockResolvedValue(mockResult);

    const result = await productsService.getProductList({
      page: 1,
      pageSize: 10,
      orderBy: 'recent',
    });

    expect(mockProductsRepo.getProductListWithFavorites).toHaveBeenCalledTimes(1);
    expect(result.list).toHaveLength(1);
    expect(result.totalCount).toBe(1);
  });
});
