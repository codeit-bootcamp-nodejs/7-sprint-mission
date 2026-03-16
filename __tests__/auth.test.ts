import request from 'supertest';
import server from '../index';

describe('인증 API', () => {
  afterAll((done) => {
    server.close(done);
  });
  it('회원가입 성공', async () => {
    const res = await request(server)
      .post('/auth/register')
      .send({ username: 'testuser', password: 'testpass' });
    expect(res.status).toBe(201);
  });

  it('로그인 성공', async () => {
    await request(server)
      .post('/auth/register')
      .send({ username: 'loginuser', password: 'loginpass' });
    const res = await request(server)
      .post('/auth/login')
      .send({ username: 'loginuser', password: 'loginpass' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
