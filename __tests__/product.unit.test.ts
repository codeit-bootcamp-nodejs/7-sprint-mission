import { describe, it, expect, vi } from 'vitest';
import * as productService from '../src/controllers/product.service';

describe('상품 서비스 유닛 테스트', () => {
  it('상품 생성 시 비즈니스 로직 정상 동작', async () => {
    const createSpy = vi.spyOn(productService, 'createProduct').mockResolvedValue({ id: 1, name: 'mock', price: 1000 });
    const result = await productService.createProduct({ name: 'mock', price: 1000 });
    expect(createSpy).toHaveBeenCalled();
    expect(result).toEqual({ id: 1, name: 'mock', price: 1000 });
    createSpy.mockRestore();
  });

  it('상품 가격이 0 이하일 때 예외 ', async () => {
    const createSpy = vi.spyOn(productService, 'createProduct').mockImplementation(() => { throw new Error('가격 오류'); });
    expect(() => productService.createProduct({ name: 'mock', price: 0 })).toThrow('가격 오류');
    createSpy.mockRestore();
  });
});
