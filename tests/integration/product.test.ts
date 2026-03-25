import request from 'supertest';
import { app } from '../../src/main';
import { prisma } from '../../src/lib/prismaClient';

describe('Products API Integration Test', () => {
  let authCookie: string[];
  let testProductId: number;
  const userEmail = `seller_${Date.now()}@example.com`;

  beforeAll(async () => {
    await request(app).post('/auth/register').send({
      email: userEmail,
      nickname: 'Seller',
      password: 'password123',
    });
    const loginRes = await request(app).post('/auth/login').send({
      email: userEmail,
      password: 'password123',
    });
    authCookie = loginRes.get('set-cookie') as unknown as string[];
  });

  afterAll(async () => {
    await prisma.product.deleteMany({ where: { name: 'Test Product' } });
    await prisma.user.deleteMany({ where: { email: userEmail } });
    await prisma.$disconnect();
  });

  describe('인증이 필요하지 않은 API', () => {
    it('상품 목록 조회 (GET /products)', async () => {
      const res = await request(app).get('/products?page=1&pageSize=10');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.list)).toBe(true);
    });
  });

  describe('인증이 필요한 API', () => {
    it('상품 생성 (POST /products) - 인증 필요', async () => {
      const res = await request(app)
        .post('/products')
        .set('Cookie', authCookie)
        .send({
          name: 'Test Product',
          description: 'This is a test product',
          price: 10000,
          tags: ['test'],
          images: ['http://example.com/image.jpg'],
        });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Test Product');
      testProductId = res.body.id;
    });

    it('인증 없이 상품 생성 시도 시 401 반환', async () => {
      const res = await request(app).post('/products').send({
        name: 'Fail Product',
        description: 'No auth',
        price: 1000,
        tags: [],
        images: [],
      });
      expect(res.status).toBe(401);
    });

    it('상품 수정 (PATCH /products/:id)', async () => {
      const res = await request(app)
        .patch(`/products/${testProductId}`)
        .set('Cookie', authCookie)
        .send({ price: 15000 });
      expect(res.status).toBe(200);
      expect(res.body.price).toBe(15000);
    });
  });
});