import request from 'supertest';
import app from '../../src/main';
import { prisma } from '../../src/lib/prisma';
import { beforeAll, describe, expect, it } from '@jest/globals';

describe('게시글 통합 테스트', () => {
    let authCookie: string;
    let otherUserCookie: string;
    let articleId: string;
    const testUserA = {
        email: 'article_test_01@example.com',
        nickname: '게시글테스트유저1',
        password: 'password123',
    };
    const testUserB = {
        email: 'article_test_02@example.com',
        nickname: '게시글테스트유저2',
        password: 'password123',
    };

    beforeAll(async () => {
        await prisma.articleLike.deleteMany().catch(() => {});
        await prisma.articleComment.deleteMany().catch(() => {});
        await prisma.article.deleteMany().catch(() => {});
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

    describe('게시글 생성', () => {
        it('인증된 유저는 게시글을 생성할 수 있다', async () => {
            const res = await request(app).post('/articles').set('Cookie', authCookie).send({
                title: '테스트 게시글 제목',
                content: '테스트 게시글 내용입니다.',
                image: 'https://example.com/test.jpg',
            });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body.title).toBe('테스트 게시글 제목');
            articleId = res.body.id; // 이후 테스트에서 사용
        });
        it('로그인하지 않으면 401 Unauthorized 를 반환한다', async () => {
            const res = await request(app)
                .post('/articles')
                .send({ title: '비인증 게시글', content: '내용' });
            expect(res.statusCode).toBe(401);
        });
    });

    describe('상세 조회', () => {
        it('존재하는 게시글을 조회할 수 있다', async () => {
            const res = await request(app).get(`/articles/${articleId}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.id).toBe(articleId);
        });

        it('존재하지 않는 ID 조회 시 404 NotFound 를 반환한다', async () => {
            const res = await request(app).get('/articles/999999');
            expect(res.statusCode).toBe(404);
        });
    });

    describe('게시글 답글 작성', () => {
        it('게시글에 댓글을 작성할 수 있다', async () => {
            const res = await request(app)
                .post(`/articles/${articleId}/comments`)
                .set('Cookie', authCookie)
                .send({
                    content: '이 게시글에 대한 댓글입니다.',
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.content).toBe('이 게시글에 대한 댓글입니다.');
        });

        it('존재하지 않는 게시글에 댓글 작성 시 404를 반환한다', async () => {
            const res = await request(app)
                .post('/articles/999999/comments')
                .set('Cookie', authCookie)
                .send({ content: '실패해야 함' });
            expect(res.statusCode).toBe(404);
        });
    });

    describe('게시글 수정', () => {
        it('본인의 게시글은 수정할 수 있다', async () => {
            const res = await request(app)
                .patch(`/articles/${articleId}`)
                .set('Cookie', authCookie)
                .send({
                    title: '수정된 제목',
                    content: '수정된 내용',
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.title).toBe('수정된 제목');
        });

        it('다른 사람의 게시글 수정 시 403 Forbidden 를 반환한다', async () => {
            const res = await request(app)
                .patch(`/articles/${articleId}`)
                .set('Cookie', otherUserCookie)
                .send({ title: '해킹 시도' });

            expect(res.statusCode).toBe(403);
        });
    });

    describe('게시글 좋아요', () => {
        it('좋아요를 처음 누르면 생성된다 (201)', async () => {
            const res = await request(app)
                .post(`/articles/${articleId}/like`)
                .set('Cookie', otherUserCookie);

            expect(res.statusCode).toBe(201);
            expect(res.body.isLiked).toBe(true);
        });

        it('좋아요를 다시 누르면 취소된다 (200)', async () => {
            const res = await request(app)
                .post(`/articles/${articleId}/like`)
                .set('Cookie', otherUserCookie);

            expect(res.statusCode).toBe(201);
            expect(res.body.isLiked).toBe(false);
        });
    });

    describe('게시글 목록 조회', () => {
        it('검색어와 페이징이 적용된 목록을 반환한다', async () => {
            const res = await request(app)
                .get('/articles')
                .query({ keyword: '수정된', page: 1, pageSize: 10 });

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.list)).toBe(true);
            expect(res.body.totalCount).toBeGreaterThanOrEqual(1);
        });

        it('좋아요한 게시글 목록을 조회할 수 있다', async () => {
            // 먼저 좋아요를 다시 눌러둔 상태로 만듦
            await request(app).post(`/articles/${articleId}/like`).set('Cookie', otherUserCookie);

            const res = await request(app)
                .get('/articles/like/list')
                .set('Cookie', otherUserCookie);

            expect(res.statusCode).toBe(200);

            const isLiked =
                res.body.data &&
                res.body.data.some((article: any) => String(article.id) === String(articleId));
            expect(isLiked).toBe(true);
        });
    });
});
