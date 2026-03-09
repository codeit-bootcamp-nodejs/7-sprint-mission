import request from 'supertest';
import { app } from '../../src/main';
import { prisma } from '../../src/lib/prismaClient';

describe('Auth API Integration Test', () => {
  const testUser = {
    email: `test_${Date.now()}@example.com`,
    nickname: 'TestUser',
    password: 'password123',
  };

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await prisma.$disconnect();
  });

  it('회원가입 API (POST /auth/register)', async () => {
    const res = await request(app).post('/auth/register').send(testUser);
    expect(res.status).toBe(201);
    expect(res.body.email).toBe(testUser.email);
    expect(res.body.password).toBeUndefined();
  });

  it('로그인 API (POST /auth/login)', async () => {
    const res = await request(app).post('/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.status).toBe(200);
    expect(res.headers['set-cookie']).toBeDefined();
  });
});