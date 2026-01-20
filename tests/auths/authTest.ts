import request from 'supertest';
import app from '../../src/main';
import { prisma } from '../../src/lib/prisma';
import { beforeAll, describe, expect, it } from '@jest/globals';

describe('유저 통합 테스트', () => {
    let authCookie: string;
    // 테스트 시작 전 DB 초기화
    beforeAll(async () => {
        await prisma.$transaction([
            prisma.articleLike.deleteMany(),
            prisma.articleComment.deleteMany(),
            prisma.productComment.deleteMany(),
            prisma.article.deleteMany(),
            prisma.product.deleteMany(),
            prisma.user.deleteMany(),
        ]);
    });

    // 각 테스트 종료 후 연결 끊기
    // afterAll(async () => {
    //     await prisma.$disconnect();
    // });

    const testUser = {
        email: 'test6661@example.com',
        nickname: '테스트유저',
        password: 'password123',
    };

    describe('회원가입', () => {
        it('새로운 유저를 성공적으로 생성해야 한다', async () => {
            const res = await request(app).post('/auth/register').send(testUser);
            console.log(res.statusCode, res.body);
            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe('회원가입 성공');
            expect(res.body.data.email).toBe(testUser.email);
        });

        it('중복된 이메일로 가입 시 409 에러를 반환해야 한다', async () => {
            const res = await request(app).post('/auth/register').send(testUser);

            expect(res.statusCode).toBe(409);
            expect(res.body.message).toContain('이미 가입된 이메일');
        });
    });
    describe('로그인', () => {
        it('올바른 정보로 로그인 시 쿠키를 반환해야 한다', async () => {
            const res = await request(app).post('/auth/login').send({
                email: testUser.email,
                password: testUser.password,
            });
            expect(res.statusCode).toBe(200);
            expect(res.headers['set-cookie']).toBeDefined();
            authCookie = res.headers['set-cookie']; // 이후 테스트를 위해 쿠키 저장
        });
    });
    describe('내 정보 조회', () => {
        it('내 정보를 가져와야 한다', async () => {
            const res = await request(app).get('/auth/me').set('Cookie', authCookie); // 확보한 쿠키 전달
            if (res.statusCode === 500) {
                console.error('서버 에러 상세:', res.body); // 에러 메시지가 찍힐 겁니다.
            }
            expect(res.statusCode).toBe(200);
            expect(res.body.data.email).toBe(testUser.email);
            expect(res.body.data.nickname).toBe(testUser.nickname);
        });
    });
    describe('내 정보 변경', () => {
        it('변경 사항이 없을 때 400 에러를 반환해야 한다(닉네임)', async () => {
            const res = await request(app)
                .patch('/auth/me')
                .set('Cookie', authCookie)
                .send({ nickname: testUser.nickname });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('수정된 내용이 없습니다.');
        });
        it('변경 사항이 없을 때 400 에러를 반환해야 한다(이메일)', async () => {
            const res = await request(app)
                .patch('/auth/me')
                .set('Cookie', authCookie)
                .send({ email: testUser.email });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('수정된 내용이 없습니다.');
        });
        it('닉네임 수정 시 성공해야 한다', async () => {
            const res = await request(app)
                .patch('/auth/me')
                .set('Cookie', authCookie)
                .send({ nickname: '새닉네임' });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.nickname).toBe('새닉네임');
        });
    });

    describe('비밀번호 변경', () => {
        it('현재 비밀번호가 틀리면 400 에러를 반환해야 한다', async () => {
            // ... 로그인 후 쿠키 설정 ...
            const res = await request(app)
                .patch('/auth/me/password')
                .set('Cookie', authCookie)
                .send({
                    currentPassword: 'wrong_password',
                    newPassword: 'new_password123!',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('현재 비밀번호가 일치하지 않습니다.');
        });

        it('비밀번호 변경 성공 시 성공 메시지를 반환한다', async () => {
            const res = await request(app)
                .patch('/auth/me/password')
                .set('Cookie', authCookie)
                .send({
                    currentPassword: testUser.password,
                    newPassword: '1234',
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('비밀번호가 성공적으로 변경되었습니다.');
        });
    });

    describe('토큰 테스트', () => {
        it('토큰이 정상적으로 갱신되어야 한다', async () => {
            const res = await request(app).post('/auth/refresh').set('Cookie', authCookie); // 보통 refresh-token 전략도 쿠키를 읽음
            expect(res.statusCode).toBe(200);
            expect(res.headers['set-cookie']).toBeDefined();
            authCookie = res.headers['set-cookie']; // 갱신된 쿠키로 교체
        });
    });

    describe('로그아웃', () => {
        it('로그아웃 시 쿠키가 삭제되어야 한다', async () => {
            const res = await request(app).post('/auth/logout').set('Cookie', authCookie);

            // 쿠키 삭제 여부 확인 (보통 set-cookie에 Max-Age=0 또는 익스파이어 상 과거 날짜가 찍힘)
            expect(res.headers['set-cookie']).toBeDefined();
            expect(res.body.message).toBe('로그아웃 되었습니다.');
        });
    });
});
