import * as productsService from '../services/productsService';
import * as productsRepository from '../repositories/productsRepository';
import * as favoritesRepository from '../repositories/favoritesRepository';
import * as notificationsService from '../services/notificationsService';
import ForbiddenError from '../lib/errors/ForbiddenError';
import NotFoundError from '../lib/errors/NotFoundError';

jest.mock('../repositories/productsRepository');
jest.mock('../repositories/favoritesRepository');
jest.mock('../services/notificationsService');

describe('Products Service 유닛 테스트', () => {
  const mockUserId = 1;
  const mockProductId = 100;

  const mockProduct = {
    id: mockProductId,
    name: '기존 상품',
    description: '설명',
    price: 10000,
    userId: mockUserId,
    tags: [],
    images: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateProduct 로직 검증', () => {
    test('상품이 존재하지 않으면 NotFoundError를 던져야 한다', async () => {
      // getProduct가 null을 반환하도록 설정
      (productsRepository.getProduct as jest.Mock).mockResolvedValue(null);

      await expect(
        productsService.updateProduct(mockProductId, { price: 20000, userId: mockUserId }),
      ).rejects.toThrow(NotFoundError);
    });

    test('작성자가 아닌 유저가 수정 시도 시 ForbiddenError를 던져야 한다', async () => {
      // 다른 유저 ID로 설정
      (productsRepository.getProduct as jest.Mock).mockResolvedValue(mockProduct);

      await expect(
        productsService.updateProduct(mockProductId, { price: 20000, userId: 999 }),
      ).rejects.toThrow(ForbiddenError);
    });

    test('가격이 변경되면 알림 생성 서비스가 호출되어야 한다 ', async () => {
      (productsRepository.getProduct as jest.Mock).mockResolvedValue(mockProduct);

      const updatedProduct = { ...mockProduct, price: 5000 }; // 가격 변경
      (productsRepository.updateProductWithFavorites as jest.Mock).mockResolvedValue(
        updatedProduct,
      );

      const mockFavorites = [{ userId: 2 }, { userId: 3 }];
      (favoritesRepository.getFavoritesByProductId as jest.Mock).mockResolvedValue(mockFavorites);

      const createNotificationsSpy = jest.spyOn(notificationsService, 'createNotifications');

      await productsService.updateProduct(mockProductId, {
        price: 5000,
        userId: mockUserId,
      });

      expect(createNotificationsSpy).toHaveBeenCalled();
      expect(createNotificationsSpy).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ userId: 2 }),
          expect.objectContaining({ userId: 3 }),
        ]),
      );
    });
  });
});
