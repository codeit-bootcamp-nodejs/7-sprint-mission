import request from 'supertest';
import app from '../../src/main';
import { prisma } from '../../src/lib/prisma';
import { beforeAll, describe, expect, it } from '@jest/globals';

describe('상품 통합 테스트', () => {
    let authCookie: string;
    let otherUserCookie: string;
    let productId: string;

    const testUserA = {
        email: 'products_test_01@example.com',
        nickname: '상품테스트유저1',
        password: 'password123',
    };
    const testUserB = {
        email: 'products_test_02@example.com',
        nickname: '상품테스트유저2',
        password: 'password123',
    };
    const baseProduct = {
        name: '테스트 상품 제목',
        description: '테스트 상품 내용',
        price: 10000,
        tags: ['태그1', '태그2', '태그3'],
        images: ['https://example.com/image.jpg'],
    };

    beforeAll(async () => {
        await prisma.productLike.deleteMany().catch(() => {});
        await prisma.productComment.deleteMany().catch(() => {});
        await prisma.product.deleteMany().catch(() => {});
        await prisma.user.deleteMany({
            where: {
                email: {
                    in: [testUserA.email, testUserB.email],
                },
            },
        });
        await request(app).post('/auth/register').send(testUserA);
        const loginTestUserARes = await request(app).post('/auth/login').send({
            email: testUserA.email,
            password: testUserA.password,
        });
        authCookie = loginTestUserARes.headers['set-cookie'];
        await request(app).post('/auth/register').send(testUserB);
        const loginTestUserBRes = await request(app).post('/auth/login').send({
            email: testUserB.email,
            password: testUserB.password,
        });
        otherUserCookie = loginTestUserBRes.headers['set-cookie'];
    });

    // afterAll(async () => {
    //     await prisma.$disconnect();
    // });

    describe('상품 생성', () => {
        it('인증된 유저는 상품을 등록할 수 있다', async () => {
            const res = await request(app)
                .post('/products')
                .set('Cookie', authCookie)
                .send(baseProduct);

            expect(res.statusCode).toBe(201);
            expect(res.body.name).toBe(baseProduct.name);
            productId = res.body.id;
        });
        it('로그인하지 않으면 상품을 등록할 수 없다 (401)', async () => {
            const res = await request(app).post('/products').send(baseProduct);
            expect(res.statusCode).toBe(401);
        });
    });

    describe('상품 수정', () => {
        it('본인의 상품은 정보를 수정할 수 있다', async () => {
            const res = await request(app)
                .patch(`/products/${productId}`)
                .set('Cookie', authCookie)
                .send({ name: '수정된 상품명', price: 20000 });

            expect(res.statusCode).toBe(200);
            expect(res.body.name).toBe('수정된 상품명');
            expect(res.body.price).toBe(20000);
        });
        it('타인의 상품을 수정하려고 하면 403 Forbidden을 반환한다', async () => {
            const res = await request(app)
                .patch(`/products/${productId}`)
                .set('Cookie', otherUserCookie)
                .send({ name: '해킹 시도' });

            expect(res.statusCode).toBe(403);
        });
    });

    describe('상품 좋아요', () => {
        it('좋아요를 누르면 성공한다 (201)', async () => {
            const res = await request(app)
                .post(`/products/${productId}/like`)
                .set('Cookie', otherUserCookie);

            expect(res.statusCode).toBe(201);
            expect(res.body.isLiked).toBe(true);
        });

        it('좋아요를 한 번 더 누르면 취소된다 (200)', async () => {
            const res = await request(app)
                .post(`/products/${productId}/like`)
                .set('Cookie', otherUserCookie);

            expect(res.statusCode).toBe(201);
            expect(res.body.isLiked).toBe(false);
        });

        it('좋아요한 상품 목록을 조회할 수 있다', async () => {
            // 다시 좋아요 누름
            await request(app).post(`/products/${productId}/like`).set('Cookie', otherUserCookie);

            const res = await request(app)
                .get('/products/like/list')
                .set('Cookie', otherUserCookie);

            expect(res.statusCode).toBe(200);

            const isLiked =
                res.body.data &&
                res.body.data.some((product: any) => String(product.id) === String(productId));
            expect(isLiked).toBe(true);
        });
    });

    describe('상품 조회', () => {
        it('상품 ID로 상세 정보를 조회할 수 있다', async () => {
            const res = await request(app).get(`/products/${productId}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.id).toBe(productId);
        });

        it('상품 목록을 페이징하여 조회할 수 있다', async () => {
            const res = await request(app).get('/products').query({ page: 1, pageSize: 10 });

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.list)).toBe(true);
        });
    });

    describe('상품 답글 작성', () => {
        it('상품에 답글(댓글)을 작성할 수 있다', async () => {
            const res = await request(app)
                .post(`/products/${productId}/comments`)
                .set('Cookie', otherUserCookie)
                .send({ content: '이 상품 아주 좋네요!' });

            expect(res.statusCode).toBe(201);
            expect(res.body.content).toBe('이 상품 아주 좋네요!');
        });

        it('상품의 답글 목록을 조회할 수 있다', async () => {
            const res = await request(app).get(`/products/${productId}/comments`);
            expect(res.statusCode).toBe(200);
            expect(res.body.list.length).toBeGreaterThan(0);
        });
    });

    describe('상품 삭제', () => {
        it('타인의 상품은 삭제할 수 없다 (403)', async () => {
            const res = await request(app)
                .delete(`/products/${productId}`)
                .set('Cookie', otherUserCookie);
            expect(res.statusCode).toBe(403);
        });

        it('본인의 상품은 삭제할 수 있다 (204)', async () => {
            const res = await request(app)
                .delete(`/products/${productId}`)
                .set('Cookie', authCookie);
            expect(res.statusCode).toBe(204);
        });

        it('삭제된 상품을 조회하면 404를 반환한다', async () => {
            const res = await request(app).get(`/products/${productId}`);
            expect(res.statusCode).toBe(404);
        });
    });
});
