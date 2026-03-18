import request from 'supertest';
import app from '../app';
import { prismaClient } from '../lib/prismaClient';

describe('Products API (인증 불필요)', () => {
  let testUserId: number;
  let testProductId: number;

  beforeAll(async () => {
    const user = await prismaClient.user.create({
      data: {
        email: 'product-public-test@example.com',
        nickname: 'tester',
        password: 'hashed-password',
      },
    });
    testUserId = user.id;

    const product = await prismaClient.product.create({
      data: {
        name: '테스트 상품',
        description: '테스트 상품 설명',
        price: 10000,
        tags: ['태그1', '태그2'],
        images: [],
        userId: testUserId,
      },
    });
    testProductId = product.id;

    await prismaClient.comment.create({
      data: {
        content: '테스트 댓글입니다.',
        productId: testProductId,
        userId: testUserId,
      },
    });
  });

  afterAll(async () => {
    await prismaClient.comment.deleteMany({ where: { productId: testProductId } });
    await prismaClient.product.delete({ where: { id: testProductId } });
    await prismaClient.user.delete({ where: { id: testUserId } });
    await prismaClient.$disconnect();
  });

  describe('GET /products', () => {
    it('상품 목록을 정상적으로 반환한다', async () => {
      const res = await request(app).get('/products');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('list');
      expect(res.body).toHaveProperty('totalCount');
      expect(Array.isArray(res.body.list)).toBe(true);
    });

    it('page, pageSize 쿼리 파라미터가 적용된다', async () => {
      const res = await request(app).get('/products?page=1&pageSize=1');
      expect(res.status).toBe(200);
      expect(res.body.list.length).toBeLessThanOrEqual(1);
    });

    it('keyword 검색이 동작한다', async () => {
      const res = await request(app).get('/products?keyword=테스트 상품');
      expect(res.status).toBe(200);
      expect(res.body.list.length).toBeGreaterThanOrEqual(1);
      expect(res.body.list[0].name).toContain('테스트 상품');
    });

    it('존재하지 않는 keyword는 빈 목록을 반환한다', async () => {
      const res = await request(app).get('/products?keyword=절대없는상품명xyz123');
      expect(res.status).toBe(200);
      expect(res.body.list).toHaveLength(0);
    });

    it('각 상품에 favoriteCount 필드가 포함된다', async () => {
      const res = await request(app).get('/products');
      expect(res.status).toBe(200);
      res.body.list.forEach((product: any) => {
        expect(product).toHaveProperty('favoriteCount');
      });
    });

    it('orderBy=recent 정렬이 동작한다', async () => {
      const res = await request(app).get('/products?orderBy=recent');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('list');
    });
  });

  describe('GET /products/:id', () => {
    it('존재하는 상품을 정상적으로 반환한다', async () => {
      const res = await request(app).get(`/products/${testProductId}`);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: testProductId,
        name: '테스트 상품',
        description: '테스트 상품 설명',
        price: 10000,
      });
    });

    it('상품에 favoriteCount 필드가 포함된다', async () => {
      const res = await request(app).get(`/products/${testProductId}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('favoriteCount');
      expect(res.body.favoriteCount).toBe(0);
    });

    it('비로그인 상태에서는 isFavorited가 undefined이다', async () => {
      const res = await request(app).get(`/products/${testProductId}`);
      expect(res.status).toBe(200);
      expect(res.body.isFavorited).toBeUndefined();
    });

    it('존재하지 않는 상품 ID는 404를 반환한다', async () => {
      const res = await request(app).get('/products/9999999');
      expect(res.status).toBe(404);
    });

    it('유효하지 않은 ID 형식은 400을 반환한다', async () => {
      const res = await request(app).get('/products/not-a-number');
      expect(res.status).toBe(400);
    });
  });

  describe('GET /products/:id/comments', () => {
    it('상품의 댓글 목록을 정상적으로 반환한다', async () => {
      const res = await request(app).get(`/products/${testProductId}/comments`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('list');
      expect(Array.isArray(res.body.list)).toBe(true);
      expect(res.body.list.length).toBeGreaterThanOrEqual(1);
    });

    it('댓글에 content 필드가 포함된다', async () => {
      const res = await request(app).get(`/products/${testProductId}/comments`);
      expect(res.status).toBe(200);
      expect(res.body.list[0]).toHaveProperty('content', '테스트 댓글입니다.');
    });

    it('존재하지 않는 상품의 댓글 목록은 빈 배열을 반환한다', async () => {
      const res = await request(app).get('/products/9999999/comments');
      expect(res.status).toBe(404);
    });
  });
});
