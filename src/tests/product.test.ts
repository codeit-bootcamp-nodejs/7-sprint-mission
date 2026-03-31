import request from 'supertest';
import app from '../app';
import prisma from '../../prisma/prisma';

describe('로그인 상태 - 상품 통합 API 테스트', () => {
  // 로그인 후 인증용 쿠키 보관
  let authCookie: string[];

  // 상품 생성 후 생성된 상품 아이디 저장
  let createdProductId: string;

  const randomId = Math.floor(Math.random() * 1000000);
  //랜덤한 숫자를 사용하여 유저 생성
  const testUser = {
    email: `test_${randomId}@example.com`,
    password: 'password123!',
    nickname: `유저_${randomId}`,
  };

  beforeAll(async () => {
    // 기존 테스트 유저나 토큰이 충돌나지 않도록 정리
    await prisma.refreshToken.deleteMany({});
    await prisma.user.deleteMany({ where: { email: testUser.email } });

    const signupRes = await request(app).post('/auth/signup').send(testUser);
    if (signupRes.status !== 201) {
      throw new Error(`회원가입 실패: ${JSON.stringify(signupRes.body)}`);
    }

    const loginRes = await request(app).post('/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    if (loginRes.status !== 200) {
      throw new Error('로그인 실패! 쿠키를 가져올 수 없습니다.');
    }

    authCookie = loginRes.get('Set-Cookie') as unknown as string[];
  });

  test('POST /product: 상품을 성공적으로 등록해야 한다.', async () => {
    const productData = {
      name: '통합 테스트 상품',
      description: '통합 테스트 상품 설명',
      price: 30000,
      tags: ['통합', '테스트'],
    };

    const response = await request(app)
      .post('/product')
      .set('Cookie', authCookie)
      .send(productData);

    createdProductId = response.body.data.id;

    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe(productData.name);
  });

  // 로그인한 쿠키를 전달하지 않고 인증 정보가 없을때 조회 실행
  test('GET /product: 상품 목록을 성공적으로 조회해야 한다.', async () => {
    const response = await request(app).get('/product');

    if (response.body.data.length > 0) {
    }

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.meta).toBeDefined();
  });

  // 로그인한 쿠키를 전달하지 않고 인증 정보가 없을때 조회 실행
  test('GET /product/:productId: 상품 상세 내용을 성공적으로 조회해야 한다.', async () => {
    const response = await request(app).get(`/product/${createdProductId}`);

    expect(response.status).toBe(200);
    expect(typeof response.body).toBe('object');
    expect(response.body.data[0].id).toBe(createdProductId.toString());
  });

  test('PATCH /product/:productId: 등록한 상품을 성공적으로 수정해야 한다.', async () => {
    const updateData = {
      name: '수정된 테스트 상품',
      description: '수정된 테스트 상품 설명',
      price: 34000,
      tags: ['수정', '테스트'],
    };

    const response = await request(app)
      .patch(`/product/${createdProductId}`)
      .set('Cookie', authCookie)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe(updateData.name);
  });

  test('DELETE /product/:productId: 등록한 상품을 성공적으로 삭제해야 한다.', async () => {
    const response = await request(app)
      .delete(`/product/${createdProductId}`)
      .set('Cookie', authCookie);

    expect(response.status).toBe(204);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
