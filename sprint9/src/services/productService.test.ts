import * as productService from './productService';
import * as productsRepository from '../repositories/productRepository';
import { prismaClient } from '../lib/prismaClient';

jest.mock('../repositories/productRepository');

describe('Product Service', () => {
  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  describe('인증이 필요없는 상품 API', () => {
    test('상품 목록을 가져올 수 있다.', async () => {
      const result = await productService.getProductList({
        page: 1,
        pageSize: 10,
        orderBy: 'recent',
      });
      expect(Array.isArray(result)).toBe(true);
    });

    test('상품 상세 정보를 가져올 수 있다.', async () => {
      const productId = 1; // 테스트용 상품 ID
      const product = await productService.getProduct(productId);
      expect(product).toHaveProperty('id', productId);
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
    });
  });

  describe('인증이 필요한 상품 API', () => {
    jest.mocked(productsRepository.createProduct).mockResolvedValue({
      id: 1,
      name: '테스트 상품',
      description: '테스트용 상품입니다.',
      price: 10000,
      userId: 1,
      tags: [],
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    test('상품을 생성할 수 있다.', async () => {
      const newProduct = {
        name: '테스트 상품',
        description: '테스트용 상품입니다.',
        price: 10000,
        tags: [],
        images: ['test-image.jpg'],
        userId: 1,
      };
      const createdProduct = await productService.createProduct(newProduct);
      expect(createdProduct).toHaveProperty('id');
      expect(createdProduct).toHaveProperty('name', newProduct.name);
      expect(createdProduct).toHaveProperty('price', newProduct.price);
    });

    test('상품을 수정할 수 있다.', async () => {
      const newProduct = await productService.createProduct({
        name: '테스트 상품',
        description: '테스트용 상품입니다.',
        price: 10000,
        tags: [],
        images: ['test-image.jpg'],
        userId: 1,
      });
      const productId = newProduct.id;

      const updatedData = {
        name: '수정된 상품 이름',
        description: '수정된 상품 설명',
        price: 15000,
        userId: newProduct.userId,
      };
      const updatedProduct = await productService.updateProduct(productId, updatedData);
      expect(updatedProduct).toHaveProperty('id', productId);
      expect(updatedProduct).toHaveProperty('name', updatedData.name);
      expect(updatedProduct).toHaveProperty('description', updatedData.description);
      expect(updatedProduct).toHaveProperty('price', updatedData.price);
      expect(updatedProduct).toHaveProperty('userId', newProduct.userId);
    });

    test('상품을 삭제할 수 있다.', async () => {
      const productId = 1; // 테스트용 상품 ID
      const deleteResult = await productService.deleteProduct(productId);
      expect(deleteResult).toBe(true);
    });
  });
});
