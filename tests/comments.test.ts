import request from 'supertest';
import app from '../src/main.js';
import { prismaClient } from '../src/lib/prismaClient.js';

describe('Comments 통합 테스트 (수정 및 삭제)', () => {
  let ownerCookie: string[] = []; // 댓글 작성자
  let otherCookie: string[] = []; // 다른 사람
  let articleId: number;
  let commentId: number;

  const ownerUser = { email: 'comm_owner@test.com', nickname: '댓글러', password: 'password123' };
  const otherUser = { email: 'comm_other@test.com', nickname: '행인', password: 'password123' };

  beforeAll(async () => {
    // 1. DB 초기화
    await prismaClient.comment.deleteMany().catch(() => {});
    await prismaClient.article.deleteMany().catch(() => {});
    await prismaClient.user.deleteMany().catch(() => {});

    // 2. 유저 생성 및 쿠키 확보 (타입 에러 방지 처리)
    await request(app).post('/auth/register').send(ownerUser);
    const loginOwner = await request(app)
      .post('/auth/login')
      .send({ email: ownerUser.email, password: ownerUser.password });
    ownerCookie = loginOwner.get('Set-Cookie') || [];

    await request(app).post('/auth/register').send(otherUser);
    const loginOther = await request(app)
      .post('/auth/login')
      .send({ email: otherUser.email, password: otherUser.password });
    otherCookie = loginOther.get('Set-Cookie') || [];

    // 3. 테스트를 위한 부모 게시글 생성
    const articleRes = await request(app)
      .post('/articles')
      .set('Cookie', ownerCookie)
      .send({ title: '댓글용 글', content: '내용', image: null });
    articleId = articleRes.body.id;

    // 4. 테스트를 위한 댓글 미리 생성
    const commentRes = await request(app)
      .post(`/articles/${articleId}/comments`)
      .set('Cookie', ownerCookie)
      .send({ content: '수정 전 댓글' });
    commentId = commentRes.body.id;
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  describe('PATCH /comments/:id (댓글 수정)', () => {
    it('댓글 작성자는 내용을 성공적으로 수정할 수 있다 (200)', async () => {
      const res = await request(app)
        .patch(`/comments/${commentId}`)
        .set('Cookie', ownerCookie)
        .send({ content: '수정된 댓글 내용' });
      // 디버깅
      if (res.statusCode === 400) {
        console.log('❌ 댓글 수정 실패 원인:', JSON.stringify(res.body, null, 2));
      }
      expect(res.statusCode).toBe(200);
      expect(res.body.content).toBe('수정된 댓글 내용');
    });

    it('타인의 댓글을 수정하려고 하면 403 Forbidden을 반환한다', async () => {
      const res = await request(app)
        .patch(`/comments/${commentId}`)
        .set('Cookie', otherCookie)
        .send({ content: '몰래 수정' });

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe('댓글 수정 권한이 없습니다.');
    });

    it('존재하지 않는 댓글 ID 수정 시 404를 반환한다', async () => {
      const res = await request(app)
        .patch('/comments/999999')
        .set('Cookie', ownerCookie)
        .send({ content: '의미 없는 수정' });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /comments/:id (댓글 삭제)', () => {
    it('타인의 댓글을 삭제하려고 하면 403 Forbidden을 반환한다', async () => {
      const res = await request(app).delete(`/comments/${commentId}`).set('Cookie', otherCookie);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe('댓글 삭제 권한이 없습니다.');
    });

    it('댓글 작성자는 본인의 댓글을 삭제할 수 있다 (204)', async () => {
      const res = await request(app).delete(`/comments/${commentId}`).set('Cookie', ownerCookie);

      expect(res.statusCode).toBe(204);
    });

    it('삭제된 후 다시 조회하거나 삭제 시 404를 반환해야 한다', async () => {
      const res = await request(app).delete(`/comments/${commentId}`).set('Cookie', ownerCookie);

      expect(res.statusCode).toBe(404);
    });
  });
});
