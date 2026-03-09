import { productService } from '../../src/services/productService';
import { productRepository } from '../../src/repositories/productRepository';
import { notificationService } from '../../src/services/notificationService';

describe('ProductService Unit Test', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('상품의 가격이 변경되면 좋아요를 누른 유저들에게 알림을 전송해야 한다', async () => {
    const userId = 1;
    const productId = 100;

    const findByIdSpy = jest.spyOn(productRepository, 'findById').mockResolvedValue({
      id: productId,
      userId: userId,
      name: 'Test Mac',
      price: 10000,
    } as any);

    const findLikersSpy = jest.spyOn(productRepository, 'findLikers').mockResolvedValue([
      { userId: 2 },
      { userId: 3 },
    ] as any);

    const updateSpy = jest.spyOn(productRepository, 'update').mockResolvedValue({
      id: productId,
      price: 15000,
    } as any);

    const notificationSpy = jest
      .spyOn(notificationService, 'createAndSend')
      .mockResolvedValue(undefined as any);

    await productService.updateProduct(userId, productId, { price: 15000 });

    expect(findByIdSpy).toHaveBeenCalledWith(productId);
    expect(findLikersSpy).toHaveBeenCalledWith(productId);
    expect(updateSpy).toHaveBeenCalledWith(productId, { price: 15000 });
    expect(notificationSpy).toHaveBeenCalledTimes(2);
    
    expect(notificationSpy).toHaveBeenNthCalledWith(
      1,
      2, 
      expect.stringContaining('15000'),
      'PRICE_CHANGE',
      productId
    );
  });
});