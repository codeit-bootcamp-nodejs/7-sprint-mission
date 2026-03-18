import {
    createArticle,
    getArticle,
    getArticleWithLkes,
    getArticleListWithLikes,
    updateArticleWithLikes,
    deleteArticle,
} from './articlesRepository';
import { prismaClient } from '../lib/prismaClient';

jest.mock('../lib/prismaClient', () => ({
    prismaClient: {
        article: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            count: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    },
}));

const mockPrisma = prismaClient.article as jest.Mocked<typeof prismaClient.article>;

// 공통 Mock 데이터
const mockArticleRaw = {
    id: 1,
    userId: 10,
    title: '테스트 게시글',
    content: '테스트 내용',
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
};

const mockArticleWithLikes = {
    ...mockArticleRaw,
    likes: [{ id: 1, userId: 10, articleId: 1, createdAt: new Date(), updatedAt: new Date() }],
};

// ----------------------------------------------------------------

describe('createArticle', () => {
    beforeEach(() => jest.clearAllMocks());

    test('article을 생성한다', async () => {
        // given
        mockPrisma.create.mockResolvedValue(mockArticleRaw);
        const createData = { userId: 10, title: '테스트 게시글', content: '테스트 내용', image: null };

        // when
        const result = await createArticle(createData);

        // then
        expect(result).toEqual(mockArticleRaw);
        expect(mockPrisma.create).toHaveBeenCalledWith({ data: createData });
    });
});

// ----------------------------------------------------------------

describe('getArticle', () => {
    beforeEach(() => jest.clearAllMocks());

    test('article을 조회한다', async () => {
        // given
        mockPrisma.findUnique.mockResolvedValue(mockArticleRaw);

        // when
        const result = await getArticle(1);

        // then
        expect(result).toEqual(mockArticleRaw);
        expect(mockPrisma.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    test('article이 없으면 null을 반환한다', async () => {
        // given
        mockPrisma.findUnique.mockResolvedValue(null);

        // when
        const result = await getArticle(999);

        // then
        expect(result).toBeNull();
    });
});

// ----------------------------------------------------------------

describe('getArticleWithLikes', () => {
    beforeEach(() => jest.clearAllMocks());

    test('article이 없으면 null을 반환한다', async () => {
        // given
        mockPrisma.findUnique.mockResolvedValue(null);

        // when
        const result = await getArticleWithLkes(999);

        // then
        expect(result).toBeNull();
    });

    test('likeCount를 계산해서 반환한다', async () => {
        // given - likes 1개
        mockPrisma.findUnique.mockResolvedValue(mockArticleWithLikes);

        // when
        const result = await getArticleWithLkes(1);

        // then
        expect(result?.likeCount).toBe(1);
        expect(result?.likes).toBeUndefined(); // likes는 숨겨짐
    });

    test('userId가 있으면 isLiked를 계산한다', async () => {
        // given - userId 10이 좋아요 누른 상태
        mockPrisma.findUnique.mockResolvedValue(mockArticleWithLikes);

        // when
        const result = await getArticleWithLkes(1, { userId: 10 });

        // then
        expect(result?.isLiked).toBe(true);
    });

    test('userId가 없으면 isLiked가 undefined다', async () => {
        // given
        mockPrisma.findUnique.mockResolvedValue(mockArticleWithLikes);

        // when
        const result = await getArticleWithLkes(1);

        // then
        expect(result?.isLiked).toBeUndefined();
    });
});

// ----------------------------------------------------------------

describe('getArticleListWithLikes', () => {
    beforeEach(() => jest.clearAllMocks());

    test('article 목록과 totalCount를 반환한다', async () => {
        // given
        mockPrisma.count.mockResolvedValue(1);
        mockPrisma.findMany.mockResolvedValue([mockArticleWithLikes]);

        // when
        const result = await getArticleListWithLikes({ page: 1, pageSize: 10 });

        // then
        expect(result.totalCount).toBe(1);
        expect(result.list).toHaveLength(1);
        expect(result.list[0].likes).toBeUndefined(); // likes는 숨겨짐
    });
});

// ----------------------------------------------------------------

describe('updateArticleWithLikes', () => {
    beforeEach(() => jest.clearAllMocks());

    test('article을 수정하고 likeCount를 계산해서 반환한다', async () => {
        // given
        mockPrisma.update.mockResolvedValue(mockArticleWithLikes);

        // when
        const result = await updateArticleWithLikes(1, { title: '수정된 게시글' });

        // then
        expect(result.likeCount).toBe(1);
        expect(mockPrisma.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { title: '수정된 게시글' },
            include: { likes: true },
        });
    });
});

// ----------------------------------------------------------------

describe('deleteArticle', () => {
    beforeEach(() => jest.clearAllMocks());

    test('article을 삭제한다', async () => {
        // given
        mockPrisma.delete.mockResolvedValue(mockArticleRaw);

        // when
        await deleteArticle(1);

        // then
        expect(mockPrisma.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
});