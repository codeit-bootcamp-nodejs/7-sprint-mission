import request from 'supertest';
import app from '../src/main.js';
import { prismaClient } from '../src/lib/prismaClient.js';
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '../src/lib/constants.js';

describe('Auth 통합 테스트 (회원가입/로그인/리프레시)', () => {
  const testUser = {
    email: `test_${Date.now()}@example.com`,
    nickname: `user_${Date.now()}`,
    password: 'password123',
  };

  let loginCookies: string[];

  // 1. 자동 DB 비우기 (에러 방지를 위해 하위 테이블부터 삭제)
  beforeAll(async () => {
    // 사용자님의 실제 스키마 모델명에 맞춰 순서대로 삭제합니다.
    await prismaClient.comment.deleteMany().catch(() => {});
    await prismaClient.product.deleteMany().catch(() => {});
    await prismaClient.article.deleteMany().catch(() => {});
    await prismaClient.user.deleteMany().catch(() => {});
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  describe('POST /auth/register (회원가입)', () => {
    it('새로운 유저를 성공적으로 생성하고 201을 반환한다 ', async () => {
      const res = await request(app).post('/auth/register').send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.email).toBe(testUser.email);
      expect(res.body).not.toHaveProperty('password'); // 보안 요구사항: 비밀번호 노출 금지
    });

    it('중복된 이메일 가입 시 BadRequestError(400)를 반환한다', async () => {
      const res = await request(app).post('/auth/register').send(testUser);

      // globalErrorHandler가 BadRequestError를 400으로 변환함
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('이미 사용중인 이메일입니다.');
    });

    it('잘못된 형식의 데이터 전송 시 StructError(400)를 반환한다 ', async () => {
      const res = await request(app).post('/auth/register').send({ email: 'not-an-email' }); // nickname, password 누락 및 형식 오류

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /auth/login (로그인)', () => {
    it('올바른 정보로 로그인 시 쿠키와 유저 정보를 반환한다 ', async () => {
      const res = await request(app).post('/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });
      if (res.statusCode !== 200) {
        console.log('로그인 실패 상세 원인:', JSON.stringify(res.body, null, 2));
      }
      expect(res.statusCode).toBe(200);
      expect(res.body.user.email).toBe(testUser.email);

      // 쿠키 설정 검증
      const cookies = res.get('Set-Cookie') || [];
      expect(cookies.some((c) => c.includes(ACCESS_TOKEN_COOKIE_NAME))).toBe(true);
      expect(cookies.some((c) => c.includes(REFRESH_TOKEN_COOKIE_NAME))).toBe(true);

      loginCookies = cookies; // 이후 인가 테스트를 위해 저장
    });

    it('틀린 비밀번호 입력 시 UnauthorizedError(401)를 반환한다 (인가)', async () => {
      const res = await request(app).post('/auth/login').send({
        email: testUser.email,
        password: 'wrongpassword',
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('비밀번호가 일치하지 않습니다');
    });
  });

  describe('POST /auth/refresh (토큰 갱신)', () => {
    it('리프레시 토큰 쿠키가 있으면 엑세스 토큰을 갱신한다 ', async () => {
      const res = await request(app).post('/auth/refresh').set('Cookie', loginCookies);

      expect(res.statusCode).toBe(200);
      // 수정한 오타 반영 완료
      expect(res.body.message).toBe('엑세스 토큰이 갱신되었습니다.');

      const cookies = res.get('Set-Cookie') || [];
      expect(cookies.some((c) => c.includes(ACCESS_TOKEN_COOKIE_NAME))).toBe(true);
    });

    it('리프레시 토큰 없이 접근하면 401을 반환한다', async () => {
      const res = await request(app).post('/auth/refresh');
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('리프레시 토큰이 없습니다. 다시 로그인 해주세요.');
    });
  });
});
