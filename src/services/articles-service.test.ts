import {
    createArticle,
    getArticle,
    getArticleList,
    updateArticle,
    deleteArticle,
} from './articlesService';
import * as articlesRepository from '../repositories/articlesRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import ForbiddenError from '../lib/errors/ForbiddenError';

jest.mock('../repositories/articlesRepository');

const mockArticlesRepo = articlesRepository as jest.Mocked<typeof articlesRepository>;

// 공통 Mock 데이터
const mockArticleSimple = {
    id: 1,
    userId: 10,
    title: '테스트 게시글',
    content: '테스트 내용',
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
};

// getArticleWithLikes 용 (likes: undefined)
const mockArticleWithLikes = {
    ...mockArticleSimple,
    likes: undefined,
    likeCount: 0,
    isLiked: false,
};

// updateArticleWithLikes 용 (likes 배열)
const mockArticleWithLikesArray = {
    ...mockArticleSimple,
    likes: [],
    likeCount: 0,
    isLiked: undefined,
};
const mockPagePaginationParams = {
    page: 1,
    pageSize: 10,
};

const mockPagePaginationResult = {
    list: [mockArticleWithLikes],
    totalCount: 1,
};

// ----------------------------------------------------------------

describe('createArticle', () => {
    beforeEach(() => jest.clearAllMocks());

    test('article을 생성하고 likeCount, isLiked를 추가해서 반환한다', async () => {
        // given
        const createData = { userId: 10, title: '테스트 게시글', content: '테스트 내용', image: null };
        const createdArticle = { id: 1, ...createData, likes: [], createdAt: new Date(), updatedAt: new Date() };

        mockArticlesRepo.createArticle.mockResolvedValue(createdArticle);

        // when
        const result = await createArticle(createData);

        // then
        expect(result).toEqual({
            ...createdArticle,
            likeCount: 0,
            isLiked: false,
        });
    });
});

// ----------------------------------------------------------------

describe('getArticle', () => {
    beforeEach(() => jest.clearAllMocks());

    test('article이 존재하면 article을 반환한다', async () => {
        // given
        mockArticlesRepo.getArticleWithLkes.mockResolvedValue(mockArticleWithLikes);

        // when
        const result = await getArticle(1);

        // then
        expect(result).toEqual(mockArticleWithLikes);
    });

    test('article이 없으면 NotFoundError를 던진다', async () => {
        // given
        mockArticlesRepo.getArticleWithLkes.mockResolvedValue(null);

        // when & then
        await expect(getArticle(999)).rejects.toThrow(NotFoundError);
    });
});

// ----------------------------------------------------------------

describe('getArticleList', () => {
    beforeEach(() => jest.clearAllMocks());

    test('article 목록을 반환한다', async () => {
        // given
        mockArticlesRepo.getArticleListWithLikes.mockResolvedValue(mockPagePaginationResult);

        // when
        const result = await getArticleList(mockPagePaginationParams);

        // then
        expect(result).toEqual(mockPagePaginationResult);
    });
});

// ----------------------------------------------------------------

describe('updateArticle', () => {
    beforeEach(() => jest.clearAllMocks());

    test('article이 없으면 NotFoundError를 던진다', async () => {
        // given
        mockArticlesRepo.getArticle.mockResolvedValue(null);

        // when & then
        await expect(updateArticle(999, { userId: 10, title: '수정' })).rejects.toThrow(NotFoundError);
    });

    test('article 작성자가 아니면 ForbiddenError를 던진다', async () => {
        // given - article 작성자: userId 10
        mockArticlesRepo.getArticle.mockResolvedValue(mockArticleSimple);

        // when & then - 다른 유저(userId 99)가 수정 시도
        await expect(updateArticle(1, { userId: 99, title: '수정' })).rejects.toThrow(ForbiddenError);
    });

    test('article 작성자가 맞으면 article을 수정한다', async () => {
        // given
        const updatedArticle = { ...mockArticleWithLikesArray, title: '수정된 게시글' };
        mockArticlesRepo.getArticle.mockResolvedValue(mockArticleSimple); // 작성자: userId 10
        mockArticlesRepo.updateArticleWithLikes.mockResolvedValue(updatedArticle);

        // when
        const result = await updateArticle(1, { userId: 10, title: '수정된 게시글' });

        // then
        expect(result).toEqual(updatedArticle);
        expect(mockArticlesRepo.updateArticleWithLikes).toHaveBeenCalledWith(1, { userId: 10, title: '수정된 게시글' });
    });
});

// ----------------------------------------------------------------

describe('deleteArticle', () => {
    beforeEach(() => jest.clearAllMocks());

    test('article이 없으면 NotFoundError를 던진다', async () => {
        // given
        mockArticlesRepo.getArticle.mockResolvedValue(null);

        // when & then
        await expect(deleteArticle(999, 10)).rejects.toThrow(NotFoundError);
    });

    test('article 작성자가 아니면 ForbiddenError를 던진다', async () => {
        // given - article 작성자: userId 10
        mockArticlesRepo.getArticle.mockResolvedValue(mockArticleSimple);

        // when & then - 다른 유저(userId 99)가 삭제 시도
        await expect(deleteArticle(1, 99)).rejects.toThrow(ForbiddenError);
    });

    test('article 작성자가 맞으면 article을 삭제한다', async () => {
        // given
        mockArticlesRepo.getArticle.mockResolvedValue(mockArticleSimple); // 작성자: userId 10
        mockArticlesRepo.deleteArticle.mockResolvedValue(mockArticleSimple);

        // when
        await deleteArticle(1, 10);

        // then
        expect(mockArticlesRepo.deleteArticle).toHaveBeenCalledWith(1);
    });
});