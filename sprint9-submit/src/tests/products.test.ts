import request from 'supertest';
import app from '../main';

describe('상품 API 통합 테스트', () => {
  let authCookie: string[];
  let testProductId: number;

  const testUser = {
    email: 'product@test.com',
    nickname: '테스트 유저',
    password: 'password123',
    image: null,
  };

  const productData = {
    name: '테스트 상품',
    description: '테스트용 상세 설명입니다.',
    price: 15000,
    tags: ['전자제품', '중고'],
    images: ['https://example.com/image.png'],
  };

  beforeAll(async () => {
    await request(app).post('/auth/register').send(testUser);
    const loginRes = await request(app).post('/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });
    authCookie = loginRes.get('Set-Cookie')!;
  });

  describe('초기 상태 및 존재하지 않는 상품 조회 (인증 미필요)', () => {
    test('GET /products - 빈 목록 반환 (200)', async () => {
      const res = await request(app).get('/products');
      expect(res.status).toBe(200);
      expect(res.body.totalCount).toBe(0);
    });

    test('GET /products/:id - 존재하지 않는 상품 조회 시 404 반환', async () => {
      const res = await request(app).get('/products/999');
      expect(res.status).toBe(404);
    });
  });

  describe('상품 생성 및 정보 확인 (인증 필요/미필요)', () => {
    test('POST /products - 상품 등록 성공 (201)', async () => {
      const res = await request(app).post('/products').set('Cookie', authCookie).send(productData);

      expect(res.status).toBe(201);
      testProductId = res.body.id; // 생성된 ID 저장
    });

    test('GET /products/:id - 등록된 상품 상세 조회 성공 (200)', async () => {
      const res = await request(app).get(`/products/${testProductId}`);
      expect(res.status).toBe(200);
      expect(res.body.name).toBe(productData.name);
      expect(res.body).toHaveProperty('favoriteCount');
    });
  });

  describe('상품 수정 및 권한 체크 (인증 필요)', () => {
    test('PATCH /products/:id - 내 상품 수정 성공 (200)', async () => {
      const updateData = { price: 20000 };
      const res = await request(app)
        .patch(`/products/${testProductId}`)
        .set('Cookie', authCookie)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.price).toBe(20000);
    });

    test('DELETE /products/:id - 쿠키 없이 삭제 시도 시 401 반환', async () => {
      const res = await request(app).delete(`/products/${testProductId}`);
      expect(res.status).toBe(401); // authenticate 미들웨어에서 걸림
    });
  });

  describe(' 상품 삭제 및 삭제 확인 (인증 필요)', () => {
    test('DELETE /products/:id - 내 상품 삭제 성공 (204)', async () => {
      const res = await request(app).delete(`/products/${testProductId}`).set('Cookie', authCookie);
      expect(res.status).toBe(204);
    });

    test('삭제 후 조회 - 삭제된 상품 조회 시 404 반환', async () => {
      const res = await request(app).get(`/products/${testProductId}`);
      expect(res.status).toBe(404);
    });
  });
});
