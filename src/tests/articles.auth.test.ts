import request from 'supertest';
import app from '../app';
import { prismaClient } from '../lib/prismaClient';

describe('Articles API (인증 필요)', () => {
  let ownerCookie: string;
  let otherCookie: string;
  let testArticleId: number;

  const ownerEmail = 'article-owner@example.com';
  const otherEmail = 'article-other@example.com';
  const password = 'Password1!';

  beforeAll(async () => {
    // 소유자 회원가입 & 로그인
    await request(app).post('/auth/register').send({
      email: ownerEmail,
      nickname: 'articleOwner',
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
      nickname: 'articleOther',
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
    const users = await prismaClient.user.findMany({
      where: { email: { in: [ownerEmail, otherEmail] } },
      select: { id: true },
    });
    const userIds = users.map((u) => u.id);

    await prismaClient.notification.deleteMany({
      where: { userId: { in: userIds } },
    });

    await prismaClient.user.deleteMany({
      where: { id: { in: userIds } },
    });

    await prismaClient.$disconnect();
  });

  describe('POST /articles', () => {
    it('인증된 유저가 게시글을 정상적으로 생성한다', async () => {
      const res = await request(app).post('/articles').set('Cookie', ownerCookie).send({
        title: '새 게시글 제목',
        content: '새 게시글 본문',
        image: null,
      });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        title: '새 게시글 제목',
        content: '새 게시글 본문',
      });
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('likeCount', 0);

      testArticleId = res.body.id; // 이후 테스트에서 사용
    });

    it('인증되지 않은 요청은 401을 반환한다', async () => {
      const res = await request(app).post('/articles').send({
        title: '미인증 게시글',
        content: '본문',
        image: null,
      });

      expect(res.status).toBe(401);
    });

    it('title 필드 누락 시 400을 반환한다', async () => {
      const res = await request(app)
        .post('/articles')
        .set('Cookie', ownerCookie)
        .send({ content: '본문만 있음', image: null });

      expect(res.status).toBe(400);
    });

    it('content 필드 누락 시 400을 반환한다', async () => {
      const res = await request(app)
        .post('/articles')
        .set('Cookie', ownerCookie)
        .send({ title: '제목만 있음', image: null });

      expect(res.status).toBe(400);
    });
  });

  describe('PATCH /articles/:id', () => {
    it('소유자가 게시글을 정상적으로 수정한다', async () => {
      const res = await request(app)
        .patch(`/articles/${testArticleId}`)
        .set('Cookie', ownerCookie)
        .send({ title: '수정된 제목', content: '수정된 본문' });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        title: '수정된 제목',
        content: '수정된 본문',
      });
    });

    it('소유자가 아닌 유저가 수정하면 403을 반환한다', async () => {
      const res = await request(app)
        .patch(`/articles/${testArticleId}`)
        .set('Cookie', otherCookie)
        .send({ title: '탈취 수정' });

      expect(res.status).toBe(403);
    });

    it('인증되지 않은 요청은 401을 반환한다', async () => {
      const res = await request(app)
        .patch(`/articles/${testArticleId}`)
        .send({ title: '미인증 수정' });

      expect(res.status).toBe(401);
    });

    it('존재하지 않는 게시글 수정 시 404를 반환한다', async () => {
      const res = await request(app)
        .patch('/articles/9999999')
        .set('Cookie', ownerCookie)
        .send({ title: '없는 게시글' });

      expect(res.status).toBe(404);
    });
  });

  describe('POST /articles/:id/comments', () => {
    it('인증된 유저가 댓글을 정상적으로 작성한다', async () => {
      const res = await request(app)
        .post(`/articles/${testArticleId}/comments`)
        .set('Cookie', otherCookie)
        .send({ content: '좋은 글이네요!', articleId: testArticleId });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('content', '좋은 글이네요!');
    });

    it('인증되지 않은 요청은 401을 반환한다', async () => {
      const res = await request(app)
        .post(`/articles/${testArticleId}/comments`)
        .send({ content: '미인증 댓글' });

      expect(res.status).toBe(401);
    });

    it('content 필드 누락 시 400을 반환한다', async () => {
      const res = await request(app)
        .post(`/articles/${testArticleId}/comments`)
        .set('Cookie', ownerCookie)
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe('POST /articles/:id/likes (좋아요)', () => {
    it('인증된 유저가 게시글에 좋아요를 누를 수 있다', async () => {
      const res = await request(app)
        .post(`/articles/${testArticleId}/likes`)
        .set('Cookie', otherCookie);

      expect(res.status).toBe(201);
    });

    it('인증되지 않은 요청은 401을 반환한다', async () => {
      const res = await request(app).post(`/articles/${testArticleId}/likes`);

      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /articles/:id/likes (좋아요 취소)', () => {
    it('좋아요한 게시글의 좋아요를 취소할 수 있다', async () => {
      const res = await request(app)
        .delete(`/articles/${testArticleId}/likes`)
        .set('Cookie', otherCookie);

      expect(res.status).toBe(204);
    });

    it('인증되지 않은 요청은 401을 반환한다', async () => {
      const res = await request(app).delete(`/articles/${testArticleId}/likes`);

      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /articles/:id', () => {
    it('소유자가 아닌 유저가 삭제하면 403을 반환한다', async () => {
      const res = await request(app)
        .delete(`/articles/${testArticleId}`)
        .set('Cookie', otherCookie);

      expect(res.status).toBe(403);
    });

    it('인증되지 않은 요청은 401을 반환한다', async () => {
      const res = await request(app).delete(`/articles/${testArticleId}`);

      expect(res.status).toBe(401);
    });

    it('소유자가 게시글을 정상적으로 삭제한다', async () => {
      const res = await request(app)
        .delete(`/articles/${testArticleId}`)
        .set('Cookie', ownerCookie);

      expect(res.status).toBe(204);
    });

    it('이미 삭제된 게시글 삭제 시 404를 반환한다', async () => {
      const res = await request(app)
        .delete(`/articles/${testArticleId}`)
        .set('Cookie', ownerCookie);

      expect(res.status).toBe(404);
    });
  });
});
