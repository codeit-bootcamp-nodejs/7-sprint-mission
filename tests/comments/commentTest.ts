import request from 'supertest';
import app from '../../src/main';
import { prisma } from '../../src/lib/prisma';
import { beforeAll, describe, expect, it } from '@jest/globals';
import { UserParam } from '../../src/lib/types/authType';

describe('답글 통합 테스트', () => {
    let authCookie: string, otherUserCookie: string;
    let productId: string, articleId: string;
    let productCommentId: string, articleCommentId: string;

    const testUserA = {
        email: 'comm_test_01@example.com',
        nickname: '답글유저1',
        password: 'password123',
    };
    const testUserB = {
        email: 'comm_test_02@example.com',
        nickname: '답글유저2',
        password: 'password123',
    };

    const setupUser = async (user: UserParam & { password: string }) => {
        await request(app).post('/auth/register').send(user);
        const res = await request(app).post('/auth/login').send({
            email: user.email,
            password: user.password,
        });
        return res.headers['set-cookie'];
    };

    beforeAll(async () => {
        await Promise.all([
            prisma.articleComment.deleteMany(),
            prisma.productComment.deleteMany(),
            prisma.product.deleteMany(),
            prisma.article.deleteMany(),
        ]);
        await prisma.user.deleteMany({
            where: { email: { in: ['comm_test_01@example.com', 'comm_test_02@example.com'] } },
        });
        authCookie = await setupUser({
            email: 'comm_test_01@example.com',
            nickname: '답글유저1',
            password: 'password123',
        } as UserParam & { password: string });
        otherUserCookie = await setupUser({
            email: 'comm_test_02@example.com',
            nickname: '답글유저2',
            password: 'password123',
        } as UserParam & { password: string });

        const [productResult, articleResult] = await Promise.all([
            request(app)
                .post('/products')
                .set('Cookie', authCookie)
                .send({
                    name: '상품',
                    description: '설명',
                    price: 1000,
                    tags: ['태그'],
                    images: ['http://img.com'],
                }),
            request(app).post('/articles').set('Cookie', authCookie).send({
                title: '게시글',
                content: '내용',
                image: 'https://example.com/default.png',
            }),
        ]);
        productId = productResult.body.id;
        articleId = articleResult.body.id;
        if (!productId || !articleId) throw new Error('부모 데이터 생성 실패로 테스트를 중단');
    });

    describe('답글 추가', () => {
        it('상품에 답글을 추가할 수 있다', async () => {
            const res = await request(app)
                .post(`/products/${productId}/comments`)
                .set('Cookie', authCookie)
                .send({ content: '상품 답글입니다.' });

            expect(res.statusCode).toBe(201);
            expect(res.body.content).toBe('상품 답글입니다.');
            productCommentId = res.body.id;
            expect(productCommentId).toBeDefined();
        });

        it('게시글에 답글을 추가할 수 있다', async () => {
            const res = await request(app)
                .post(`/articles/${articleId}/comments`)
                .set('Cookie', authCookie)
                .send({ content: '게시글 답글입니다.' });

            expect(res.statusCode).toBe(201);
            articleCommentId = res.body.id;
            expect(articleCommentId).toBeDefined();
        });
    });

    describe('답글 수정', () => {
        it('본인이 작성한 답글은 수정할 수 있다(상품)', async () => {
            const res = await request(app)
                .patch(`/products/${productId}/comments/${productCommentId}`)
                .set('Cookie', authCookie)
                .send({ content: '수정된 답글 내용' });

            expect(res.statusCode).toBe(200);
            console.log(res.statusCode, res.body);
            console.log(res.text);
            expect(res.body.content).toBe('수정된 답글 내용');
        });

        it('타인의 답글을 수정하려고 하면 403 에러를 반환한다(상품)', async () => {
            const res = await request(app)
                .patch(`/products/${productId}/comments/${productCommentId}`)
                .set('Cookie', otherUserCookie)
                .send({ content: '답글 내용' });

            expect(res.statusCode).toBe(403);
        });

        it('존재하지 않는 답글 수정 시 404 에러를 반환한다(상품)', async () => {
            const res = await request(app)
                .patch(`/products/${productId}/comments/999999`)
                .set('Cookie', authCookie)
                .send({ content: '답글 내용' });

            expect(res.statusCode).toBe(404);
        });

        it('본인이 작성한 답글은 수정할 수 있다(게시글)', async () => {
            const res = await request(app)
                .patch(`/articles/${articleId}/comments/${articleCommentId}`)
                .set('Cookie', authCookie)
                .send({ content: '수정된 답글 내용' });

            expect(res.statusCode).toBe(200);
            console.log(res.statusCode, res.body);
            console.log(res.text);
            expect(res.body.content).toBe('수정된 답글 내용');
        });

        it('타인의 답글을 수정하려고 하면 403 에러를 반환한다(게시글)', async () => {
            const res = await request(app)
                .patch(`/articles/${articleId}/comments/${articleCommentId}`)
                .set('Cookie', otherUserCookie)
                .send({ content: '답글 내용' });

            expect(res.statusCode).toBe(403);
        });

        it('존재하지 않는 답글 수정 시 404 에러를 반환한다(게시글)', async () => {
            const res = await request(app)
                .patch(`/articles/${articleId}/comments/999999`)
                .set('Cookie', authCookie)
                .send({ content: '답글 내용' });

            expect(res.statusCode).toBe(404);
        });
    });

    describe('답글 삭제', () => {
        it('타인의 답글은 삭제할 수 없다(상품)', async () => {
            const res = await request(app)
                .delete(`/products/${productId}/comments/${productCommentId}`)
                .set('Cookie', otherUserCookie);

            expect(res.statusCode).toBe(403);
        });

        it('본인의 답글은 삭제할 수 있다(상품)', async () => {
            const res = await request(app)
                .delete(`/products/${productId}/comments/${productCommentId}`)
                .set('Cookie', authCookie);

            expect(res.statusCode).toBe(204);
        });

        it('삭제된 후 다시 삭제를 시도하면 404 에러를 반환한다(상품)', async () => {
            const res = await request(app)
                .delete(`/products/${productId}/comments/${productCommentId}`)
                .set('Cookie', authCookie);

            expect(res.statusCode).toBe(404);
        });

        it('타인의 답글은 삭제할 수 없다(게시글)', async () => {
            const res = await request(app)
                .delete(`/articles/${articleId}/comments/${articleCommentId}`)
                .set('Cookie', otherUserCookie);
            4;
            expect(res.statusCode).toBe(403);
        });

        it('본인의 답글은 삭제할 수 있다(게시글)', async () => {
            const res = await request(app)
                .delete(`/articles/${articleId}/comments/${articleCommentId}`)
                .set('Cookie', authCookie);

            expect(res.statusCode).toBe(204);
        });

        it('삭제된 후 다시 삭제를 시도하면 404 에러를 반환한다(게시글)', async () => {
            const res = await request(app)
                .delete(`/articles/${articleId}/comments/${articleCommentId}`)
                .set('Cookie', authCookie);

            expect(res.statusCode).toBe(404);
        });
    });
});
