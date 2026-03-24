import request from 'supertest';
import app from '../src/main.js';
import { prismaClient } from '../src/lib/prismaClient.js';
import { ACCESS_TOKEN_COOKIE_NAME } from '../src/lib/constants.js';

describe('Users 통합 테스트 (내 정보 및 상품 목록)', () => {
  let userTokenCookie: string;
  const testUser = {
    email: `user_${Date.now()}@test.com`,
    nickname: '테스터',
    password: 'password123!',
  };

  // 1. 자동 DB 비우기 및 테스트용 세션(쿠키) 준비
  beforeAll(async () => {
    // 하위 테이블부터 역순으로 삭제
    await prismaClient.favorite.deleteMany().catch(() => {});
    await prismaClient.product.deleteMany().catch(() => {});
    await prismaClient.article.deleteMany().catch(() => {});
    await prismaClient.user.deleteMany().catch(() => {});

    // 유저 생성 및 로그인하여 쿠키 확보
    await request(app).post('/auth/register').send(testUser);
    const loginRes = await request(app).post('/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    const cookies = loginRes.get('Set-Cookie') || [];
    userTokenCookie = cookies.find((c) => c.includes(ACCESS_TOKEN_COOKIE_NAME)) || '';
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  describe('내 정보 관리 (/me)', () => {
    it('GET /users/me: 정보를 조회하면 비밀번호와 리프레시토큰이 없어야 한다 (미션4)', async () => {
      const res = await request(app).get('/users/me').set('Cookie', [userTokenCookie]);

      expect(res.statusCode).toBe(200);
      expect(res.body.email).toBe(testUser.email);
      // 컨트롤러에서 제외한 필드들 검증
      expect(res.body).not.toHaveProperty('password');
      expect(res.body).not.toHaveProperty('refreshToken');
    });

    it('PATCH /users/me: 정보를 수정하면 수정된 객체를 반환한다', async () => {
      const res = await request(app)
        .patch('/users/me')
        .set('Cookie', [userTokenCookie])
        .send({ nickname: '새로운닉네임' });

      expect(res.statusCode).toBe(200);
      expect(res.body.nickname).toBe('새로운닉네임');
    });
  });

  describe('비밀번호 관리 (/me/password)', () => {
    it('POST /users/me/password: 현재 비밀번호가 맞으면 성공 메시지를 보낸다', async () => {
      const res = await request(app)
        .post('/users/me/password')
        .set('Cookie', [userTokenCookie])
        .send({
          currentPassword: testUser.password,
          newPassword: 'changed-pass-123',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('비밀번호가 변경되었습니다.');
    });

    it('틀린 비밀번호를 보내면 400 에러를 반환한다', async () => {
      const res = await request(app)
        .post('/users/me/password')
        .set('Cookie', [userTokenCookie])
        .send({
          currentPassword: 'wrong-password',
          newPassword: 'dummy',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('비밀번호가 일치하지 않습니다.');
    });
  });

  describe('내 목록 조회 ', () => {
    it('GET /users/me/products: 내가 등록한 상품 목록을 배열로 반환한다', async () => {
      const res = await request(app)
        .get('/users/me/products') // 수정하신 경로 반영
        .set('Cookie', [userTokenCookie]);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /users/me/favorites: 좋아요한 상품 목록을 반환한다', async () => {
      const res = await request(app).get('/users/me/favorites').set('Cookie', [userTokenCookie]);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
