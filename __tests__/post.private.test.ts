import request from 'supertest';
import server from '../index';

let token: string;

describe('게시글 API (인증 필요)', () => {
  beforeAll(async () => {
    await request(server)
      .post('/auth/register')
      .send({ username: 'postuser', password: 'postpass' });
    const res = await request(server)
      .post('/auth/login')
      .send({ username: 'postuser', password: 'postpass' });
    token = res.body.token;
  });

  afterAll((done) => {
    server.close(done);
  });

  it('게시글 생성', async () => {
    const res = await request(server)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '테스트 게시글', content: 'ㅁㄴㅇ' });
    expect(res.status).toBe(201);
  });

  it('게시글 수정', async () => {
    const createRes = await request(server)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '수정 게시글', content: 'adw' });
    const postId = createRes.body.id;
    const res = await request(server)
      .put(`/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '수정된 게시글', content: 'qwe' });
    expect(res.status).toBe(200);
  });
});
