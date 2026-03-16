import request from 'supertest';
import server from '../index';

let token: string;

describe('상품 API (인증 필요)', () => {
  beforeAll(async () => {
    await request(server)
      .post('/auth/register')
      .send({ username: 'privateuser', password: 'privatepass' });
    const res = await request(server)
      .post('/auth/login')
      .send({ username: 'privateuser', password: 'privatepass' });
    token = res.body.token;
  });

  afterAll((done) => {
    server.close(done);
  });

  it('상품 생성', async () => {
    const res = await request(server)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '테스트 상품', price: 1000 });
    expect(res.status).toBe(201);
  });

  it('상품수정', async () => {
    const createRes = await request(server)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '수정 상품', price: 2000 });
    const productId = createRes.body.id;
    const res = await request(server)
      .put(`/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '수정된 상품', price: 3000 });
    expect(res.status).toBe(200);
  });
});
