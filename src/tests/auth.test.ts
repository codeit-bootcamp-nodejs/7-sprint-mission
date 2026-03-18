import request from 'supertest';
import app from '../app';
import { prismaClient } from '../lib/prismaClient';

describe('Auth API (회원가입 / 로그인)', () => {
  const createdEmails: string[] = [];

  afterAll(async () => {
    await prismaClient.user.deleteMany({
      where: { email: { in: createdEmails } },
    });
    await prismaClient.$disconnect();
  });

  describe('POST /auth/register', () => {
    it('올바른 정보로 회원가입하면 201과 유저 정보를 반환한다', async () => {
      const email = 'register-success@example.com';
      createdEmails.push(email);

      const res = await request(app).post('/auth/register').send({
        email,
        nickname: 'newuser',
        password: 'Password1!',
        image: null,
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('email', email);
      expect(res.body).toHaveProperty('nickname', 'newuser');
      // 비밀번호는 응답에 포함되지 않아야 함
      expect(res.body).not.toHaveProperty('password');
    });

    it('이미 존재하는 이메일로 가입하면 400을 반환한다', async () => {
      const email = 'register-duplicate@example.com';
      createdEmails.push(email);

      await request(app).post('/auth/register').send({
        email,
        nickname: 'user1',
        password: 'Password1!',
      });

      const res = await request(app).post('/auth/register').send({
        email,
        nickname: 'user2',
        password: 'Password1!',
      });

      expect(res.status).toBe(400);
    });

    it('email 필드 누락 시 400을 반환한다', async () => {
      const res = await request(app).post('/auth/register').send({
        nickname: 'noEmail',
        password: 'Password1!',
      });

      expect(res.status).toBe(400);
    });

    it('nickname 필드 누락 시 400을 반환한다', async () => {
      const res = await request(app).post('/auth/register').send({
        email: 'no-nickname@example.com',
        password: 'Password1!',
      });

      expect(res.status).toBe(400);
    });

    it('password 필드 누락 시 400을 반환한다', async () => {
      const res = await request(app).post('/auth/register').send({
        email: 'no-password@example.com',
        nickname: 'noPass',
      });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    const loginEmail = 'login-test@example.com';
    const loginPassword = 'Password1!';

    beforeAll(async () => {
      createdEmails.push(loginEmail);
      await request(app).post('/auth/register').send({
        email: loginEmail,
        nickname: 'loginuser',
        password: loginPassword,
        image: null,
      });
    });

    it('올바른 이메일/비밀번호로 로그인하면 200을 반환한다', async () => {
      const res = await request(app).post('/auth/login').send({
        email: loginEmail,
        password: loginPassword,
      });

      expect(res.status).toBe(200);
    });

    it('로그인 성공 시 access-token 쿠키가 설정된다', async () => {
      const res = await request(app).post('/auth/login').send({
        email: loginEmail,
        password: loginPassword,
      });

      expect(res.status).toBe(200);
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      const hasAccessToken = (cookies as unknown as string[]).some((cookie: string) =>
        cookie.startsWith('access-token='),
      );
      expect(hasAccessToken).toBe(true);
    });

    it('존재하지 않는 이메일로 로그인하면 400을 반환한다', async () => {
      const res = await request(app).post('/auth/login').send({
        email: 'notexist@example.com',
        password: loginPassword,
      });

      expect(res.status).toBe(400);
    });

    it('잘못된 비밀번호로 로그인하면 400을 반환한다', async () => {
      const res = await request(app).post('/auth/login').send({
        email: loginEmail,
        password: 'WrongPassword!',
      });

      expect(res.status).toBe(400);
    });

    it('email 필드 누락 시 400을 반환한다', async () => {
      const res = await request(app).post('/auth/login').send({
        password: loginPassword,
      });

      expect(res.status).toBe(400);
    });

    it('password 필드 누락 시 400을 반환한다', async () => {
      const res = await request(app).post('/auth/login').send({
        email: loginEmail,
      });

      expect(res.status).toBe(400);
    });
  });
});
