import request from 'supertest';
import app from '../app';
import { prismaClient } from '../lib/prismaClient';

describe('Products API (인증 필요)', () => {
  let ownerCookie: string;
  let otherCookie: string;
  let testProductId: number;

  const ownerEmail = 'product-owner@example.com';
  const otherEmail = 'product-other@example.com';
  const password = 'Password1!';

  beforeAll(async () => {
    // 소유자 회원가입 & 로그인
    await request(app).post('/auth/register').send({
      email: ownerEmail,
      nickname: 'owner',
      password,
      image: null,
    });
    const ownerLogin = await request(app).post('/auth/login').send({
      email: ownerEmail,
      password,
    });
    ownerCookie = ownerLogin.headers['set-cookie'][0];

    // 다른 유저 회원가입 & 로그인
    await request(app).post('/auth/register').send({
      email: otherEmail,
      nickname: 'other',
      password,
      image: null,
    });
    const otherLogin = await request(app).post('/auth/login').send({
      email: otherEmail,
      password,
    });
    otherCookie = otherLogin.headers['set-cookie'][0];
  });

  afterAll(async () => {
    await prismaClient.user.deleteMany({
      where: { email: { in: [ownerEmail, otherEmail] } },
    });
    await prismaClient.$disconnect();
  });

  describe('POST /products', () => {
    it('인증된 유저가 상품을 정상적으로 생성한다', async () => {
      const res = await request(app)
        .post('/products')
        .set('Cookie', ownerCookie)
        .send({
          name: '새 상품',
          description: '새 상품 설명',
          price: 20000,
          tags: ['태그A'],
          images: [],
        });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        name: '새 상품',
        description: '새 상품 설명',
        price: 20000,
      });
      expect(res.body).toHaveProperty('id');

      testProductId = res.body.id; // 이후 테스트에서 사용
    });

    it('인증되지 않은 요청은 401을 반환한다', async () => {
      const res = await request(app).post('/products').send({
        name: '미인증 상품',
        description: '설명',
        price: 1000,
        tags: [],
        images: [],
      });

      expect(res.status).toBe(401);
    });

    it('name 필드 누락 시 400을 반환한다', async () => {
      const res = await request(app).post('/products').set('Cookie', ownerCookie).send({
        description: '설명',
        price: 1000,
        tags: [],
        images: [],
      });

      expect(res.status).toBe(400);
    });

    it('price 필드 누락 시 400을 반환한다', async () => {
      const res = await request(app).post('/products').set('Cookie', ownerCookie).send({
        name: '상품명',
        description: '설명',
        tags: [],
        images: [],
      });

      expect(res.status).toBe(400);
    });
  });

  describe('PATCH /products/:id', () => {
    it('소유자가 상품을 정상적으로 수정한다', async () => {
      const res = await request(app)
        .patch(`/products/${testProductId}`)
        .set('Cookie', ownerCookie)
        .send({ name: '수정된 상품명', price: 25000 });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        name: '수정된 상품명',
        price: 25000,
      });
    });

    it('소유자가 아닌 유저가 수정하면 403을 반환한다', async () => {
      const res = await request(app)
        .patch(`/products/${testProductId}`)
        .set('Cookie', otherCookie)
        .send({ name: '탈취 수정' });

      expect(res.status).toBe(403);
    });

    it('인증되지 않은 요청은 401을 반환한다', async () => {
      const res = await request(app)
        .patch(`/products/${testProductId}`)
        .send({ name: '미인증 수정' });

      expect(res.status).toBe(401);
    });

    it('존재하지 않는 상품 수정 시 404를 반환한다', async () => {
      const res = await request(app)
        .patch('/products/9999999')
        .set('Cookie', ownerCookie)
        .send({ name: '없는 상품' });

      expect(res.status).toBe(404);
    });
  });

  describe('POST /products/:id/comments', () => {
    it('인증된 유저가 댓글을 정상적으로 작성한다', async () => {
      const res = await request(app)
        .post(`/products/${testProductId}/comments`)
        .set('Cookie', otherCookie)
        .send({ content: '좋은 상품이네요!', productId: testProductId });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('content', '좋은 상품이네요!');
    });

    it('인증되지 않은 요청은 401을 반환한다', async () => {
      const res = await request(app)
        .post(`/products/${testProductId}/comments`)
        .send({ content: '미인증 댓글' });

      expect(res.status).toBe(401);
    });

    it('content 필드 누락 시 400을 반환한다', async () => {
      const res = await request(app)
        .post(`/products/${testProductId}/comments`)
        .set('Cookie', ownerCookie)
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe('POST /products/:id/favorites (찜하기)', () => {
    it('인증된 유저가 상품을 찜할 수 있다', async () => {
      const res = await request(app)
        .post(`/products/${testProductId}/favorites`)
        .set('Cookie', otherCookie);

      expect(res.status).toBe(201);
    });

    it('인증되지 않은 요청은 401을 반환한다', async () => {
      const res = await request(app).post(`/products/${testProductId}/favorites`);

      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /products/:id/favorites (찜 취소)', () => {
    it('찜한 상품을 찜 취소할 수 있다', async () => {
      const res = await request(app)
        .delete(`/products/${testProductId}/favorites`)
        .set('Cookie', otherCookie);

      expect(res.status).toBe(204);
    });

    it('인증되지 않은 요청은 401을 반환한다', async () => {
      const res = await request(app).delete(`/products/${testProductId}/favorites`);

      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /products/:id', () => {
    it('소유자가 아닌 유저가 삭제하면 403을 반환한다', async () => {
      const res = await request(app)
        .delete(`/products/${testProductId}`)
        .set('Cookie', otherCookie);

      expect(res.status).toBe(403);
    });

    it('인증되지 않은 요청은 401을 반환한다', async () => {
      const res = await request(app).delete(`/products/${testProductId}`);

      expect(res.status).toBe(401);
    });

    it('소유자가 상품을 정상적으로 삭제한다', async () => {
      const res = await request(app)
        .delete(`/products/${testProductId}`)
        .set('Cookie', ownerCookie);

      expect(res.status).toBe(204);
    });

    it('이미 삭제된 상품 삭제 시 404를 반환한다', async () => {
      const res = await request(app)
        .delete(`/products/${testProductId}`)
        .set('Cookie', ownerCookie);

      expect(res.status).toBe(404);
    });
  });
});
