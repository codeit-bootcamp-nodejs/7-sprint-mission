import request from "supertest";
import app from '../app'

describe('Auth API', () => {
    const user = {
        email: 'test@test.com',
        nickname: 'tester',
        password: '123456',
        image: null,
    };

    test('회원가입 성공 테스트', async () => {
        const res = await request(app).post('/auth/register').send(user);
        
        expect(res.status).toBe(201);
        expect(res.body.email).toBe(user.email);
    });

    test('로그인 성공 테스트', async () => {
        await request(app).post('/auth/register').send(user);

        const res = await request(app)
        .post('/auth/login')
        .send({ email: user.email, password: user.password});

        expect(res.status).toBe(200);
        expect(res.headers['set-cookie']).toBeDefined();
    })
})