import request from 'supertest';
import app from '../main';
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '../lib/constants';

describe('인증 API 통합 테스트', () => {
  const testUser = {
    email: 'test@test.com',
    nickname: '테스트 유저',
    password: 'password123',
    image: null,
  };

  //회원가입 테스트
  describe('POST /auth/register', () => {
    test('성공시 201 상태코드와 비밀번호를 제외한 유저정보 반환 ', async () => {
      const res = await request(app).post('/auth/register').send(testUser);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('email', testUser.email);
      expect(res.body).toHaveProperty('nickname', testUser.nickname);
      expect(res.body).not.toHaveProperty('password');
    });
    //필수 필드 누락시 400 반환
    test.each([
      { missingField: 'email', data: { nickname: 'test', password: 'pw' } },
      { missingField: 'nickname', data: { email: 'test@test.com', password: 'pw' } },
      { missingField: 'password', data: { email: 'test@test.com', nickname: 'test' } },
      { missingField: 'empty email', data: { email: '', nickname: 'test', password: 'pw' } },
    ])('$missingField 필드가 누락되거나 비어있으면 400을 반환', async ({ data }) => {
      const res = await request(app).post('/auth/register').send(data);
      expect(res.status).toBe(400);
    });

    test('이미 존재하는 이메일일 경우 400반환', async () => {
      const res = await request(app).post('/auth/register').send(testUser);
      expect(res.status).toBe(400);
    });
  });

  //로그인 테스트
  describe('POST /auth/login', () => {
    test('로그인 성공시 200 반환 및 쿠키 설정', async () => {
      const res = await request(app).post('/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });
      expect(res.status).toBe(200);
      //쿠키 확인
      const cookies = res.get('Set-Cookie');
      expect(cookies?.some((c) => c.includes(ACCESS_TOKEN_COOKIE_NAME))).toBe(true);
      expect(cookies?.some((c) => c.includes(REFRESH_TOKEN_COOKIE_NAME))).toBe(true);
    });

    test('이메일 없이 로그인 시도시 400 반환(Superstruct검증)', async () => {
      const res = await request(app).post('/auth/login').send({
        password: testUser.password,
      });
      expect(res.status).toBe(400);
    });

    test('잘못된 비밀번호일 경우 400 반환', async () => {
      const res = await request(app).post('/auth/login').send({
        email: testUser.email,
        password: 'wrongpassword',
      });
      expect(res.status).toBe(400);
    });
  });

  //로그아웃 테스트
  describe('POST /auth/logout', () => {
    test('성공시 200 반환 및 쿠키 해제', async () => {
      const res = await request(app).post('/auth/logout');
      expect(res.status).toBe(200);
      const cookies = res.get('Set-Cookie');
      expect(cookies?.some((c) => c.includes('Max-Age=0') || c.includes('Expires='))).toBe(true);
    });
  });
});
