import request from 'supertest';
import { app } from '../../src/main';
import { prisma } from '../../src/lib/prismaClient';

describe('Articles API Integration Test', () => {
  let authCookie: string[];
  const userEmail = `writer_${Date.now()}@example.com`;

  beforeAll(async () => {
    await request(app).post('/auth/register').send({
      email: userEmail,
      nickname: 'Writer',
      password: 'password123',
    });
    const loginRes = await request(app).post('/auth/login').send({
      email: userEmail,
      password: 'password123',
    });
    authCookie = loginRes.get('set-cookie') as unknown as string[];
  });

  afterAll(async () => {
    await prisma.article.deleteMany({ where: { title: 'Test Article' } });
    await prisma.user.deleteMany({ where: { email: userEmail } });
    await prisma.$disconnect();
  });

  describe('인증이 필요하지 않은 API', () => {
    it('게시글 목록 조회 (GET /articles)', async () => {
      const res = await request(app).get('/articles?page=1&pageSize=10');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.list)).toBe(true);
    });
  });

  describe('인증이 필요한 API', () => {
    it('게시글 생성 (POST /articles)', async () => {
      const res = await request(app)
        .post('/articles')
        .set('Cookie', authCookie)
        .send({
          title: 'Test Article2',
          content: 'This is a test article content',
        });

      expect(res.status).toBe(201);
      const createdId = res.body.id;
      expect(createdId).toBeDefined();

      await prisma.article.delete({ where: { id: res.body.id } });
    });

    it('본인 게시글 삭제 (DELETE /articles/:id)', async () => {
      const articleRes = await request(app)
        .post('/articles')
        .set('Cookie', authCookie)
        .send({
          title: 'Test Article',
          content: 'This is a test article content',
        });
      const idForDelete = articleRes.body.id;

      const res = await request(app)
        .delete(`/articles/${idForDelete}`)
        .set('Cookie', authCookie);
      expect(res.status).toBe(204);
    });

    it('존재하지 않는 게시글 삭제하면 404', async () => {
      const res = await request(app)
        .delete('/articles/999999')
        .set('Cookie', authCookie);

      expect(res.status).toBe(404);
    });

    it('로그인 없이 게시글 생성하면 401', async () => {
      const res = await request(app).post('/articles').send({
        title: 'No Auth',
        content: 'Should fail',
      });

      expect(res.status).toBe(401);
    });

    it('게시글 수정 성공', async () => {
      const articleRes = await request(app)
        .post('/articles')
        .set('Cookie', authCookie)
        .send({
          title: 'Update Test',
          content: 'content',
        });

      const id = articleRes.body.id;

      const res = await request(app)
        .patch(`/articles/${id}`)
        .set('Cookie', authCookie)
        .send({
          title: 'Updated Title',
        });

      expect(res.status).toBe(200);
    });

    it('존재하지 않는 게시글 조회', async () => {
      const res = await request(app).get('/articles/999999');

      expect(res.status).toBe(404);
    });
  });
});
