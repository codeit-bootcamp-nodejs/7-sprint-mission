// comments.service.test.ts
import {
    createComment,
    getComment,
    getCommentListByArticleId,
    getCommentListByProductId,
    updateComment,
    deleteComment,
} from './commentsService';
import * as articlesRepository from '../repositories/articlesRepository';
import * as commentsRepository from '../repositories/commentsRepository';
import * as productsRepository from '../repositories/productsRepository';
import * as notificationsService from './notifications-service';
import BadRequestError from '../lib/errors/BadRequestError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import NotFoundError from '../lib/errors/NotFoundError';
import { NotificationType } from '../types/Notification';

// Mock 처리
jest.mock('../repositories/articlesRepository');
jest.mock('../repositories/commentsRepository');
jest.mock('../repositories/productsRepository');
jest.mock('../services/notifications-service');

const mockArticlesRepo = articlesRepository as jest.Mocked<typeof articlesRepository>;
const mockCommentsRepo = commentsRepository as jest.Mocked<typeof commentsRepository>;
const mockProductsRepo = productsRepository as jest.Mocked<typeof productsRepository>;
const mockNotificationsService = notificationsService as jest.Mocked<typeof notificationsService>;

// 공통 Mock 데이터
const mockArticle = {
    id: 1,
    userId: 10,
    title: '테스트 게시글',
    content: '테스트 내용',
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
};
const mockProduct = {
    id: 1,
    userId: 10,
    name: '테스트 상품',
    description: '테스트 설명',
    price: 10000,
    tags: [],
    images: [],
    createdAt: new Date(),
    updatedAt: new Date(),
};
const mockComment = { id: 1, userId: 20, content: '테스트 댓글', articleId: 1, productId: null, createdAt: new Date(), updatedAt: new Date() };
const paginationParams = { limit: 10, cursor: 0 };
const mockPaginationResult = { list: [mockComment], nextCursor: null };
const mockNotification = {
    id: 1,
    userId: 10,
    type: NotificationType.NEW_COMMENT,
    payload: { articleId: 1 },
    read: false,
    createdAt: new Date(),
    updatedAt: new Date(),
};

// ----------------------------------------------------------------

describe('createComment', () => {
    beforeEach(() => jest.clearAllMocks());

    test('articleId도 productId도 없으면 BadRequestError를 던진다', async () => {
        await expect(
            createComment({ userId: 20, content: '댓글' })
        ).rejects.toThrow(BadRequestError);
    });

    test('articleId가 있는데 article이 없으면 NotFoundError를 던진다', async () => {
        mockArticlesRepo.getArticle.mockResolvedValue(null);

        await expect(
            createComment({ userId: 20, content: '댓글', articleId: 999 })
        ).rejects.toThrow(NotFoundError);
    });

    test('productId가 있는데 product가 없으면 NotFoundError를 던진다', async () => {
        mockProductsRepo.getProduct.mockResolvedValue(null);

        await expect(
            createComment({ userId: 20, content: '댓글', productId: 999 })
        ).rejects.toThrow(NotFoundError);
    });

    test('articleId가 있고 댓글 작성자와 게시글 작성자가 다르면 알림을 보낸다', async () => {
        // given
        mockArticlesRepo.getArticle.mockResolvedValue(mockArticle); // article 작성자: userId 10
        mockCommentsRepo.createComment.mockResolvedValue(mockComment);
        mockNotificationsService.createNotification.mockResolvedValue(mockNotification);

        // when - 댓글 작성자: userId 20 (article 작성자와 다름)
        await createComment({ userId: 20, content: '댓글', articleId: 1 });

        // then
        expect(mockNotificationsService.createNotification).toHaveBeenCalledWith({
            userId: mockArticle.userId, // 게시글 작성자에게 알림
            type: NotificationType.NEW_COMMENT,
            payload: { articleId: 1 },
        });
    });

    test('댓글 작성자와 게시글 작성자가 같으면 알림을 보내지 않는다', async () => {
        // given
        mockArticlesRepo.getArticle.mockResolvedValue(mockArticle); // article 작성자: userId 10
        mockCommentsRepo.createComment.mockResolvedValue(mockComment);

        // when - 댓글 작성자: userId 10 (article 작성자와 같음)
        await createComment({ userId: 10, content: '댓글', articleId: 1 });

        // then
        expect(mockNotificationsService.createNotification).not.toHaveBeenCalled();
    });
});

// ----------------------------------------------------------------

describe('getComment', () => {
    beforeEach(() => jest.clearAllMocks());

    test('comment가 존재하면 comment를 반환한다', async () => {
        // given
        mockCommentsRepo.getComment.mockResolvedValue(mockComment);

        // when
        const result = await getComment(1);

        // then
        expect(result).toEqual(mockComment);
    });

    test('comment가 없으면 NotFoundError를 던진다', async () => {
        // given
        mockCommentsRepo.getComment.mockResolvedValue(null);

        // when & then
        await expect(getComment(999)).rejects.toThrow(NotFoundError);
    });
});

// ----------------------------------------------------------------

describe('getCommentListByArticleId', () => {
    beforeEach(() => jest.clearAllMocks());

    test('article이 존재하면 댓글 목록을 반환한다', async () => {
        // given
        mockArticlesRepo.getArticle.mockResolvedValue(mockArticle);
        mockCommentsRepo.getCommentList.mockResolvedValue(mockPaginationResult);

        // when
        const result = await getCommentListByArticleId(1, paginationParams);

        // then
        expect(result).toEqual(mockPaginationResult);
    });

    test('article이 없으면 NotFoundError를 던진다', async () => {
        // given
        mockArticlesRepo.getArticle.mockResolvedValue(null);

        // when & then
        await expect(getCommentListByArticleId(999, paginationParams)).rejects.toThrow(NotFoundError);
    });

    test('commentsRepository가 올바른 인자로 호출된다', async () => {
        // given
        mockArticlesRepo.getArticle.mockResolvedValue(mockArticle);
        mockCommentsRepo.getCommentList.mockResolvedValue(mockPaginationResult);

        // when
        await getCommentListByArticleId(1, paginationParams);

        // then
        expect(mockCommentsRepo.getCommentList).toHaveBeenCalledWith({ articleId: 1 }, paginationParams);
    });
});

// ----------------------------------------------------------------

describe('getCommentListByProductId', () => {
    beforeEach(() => jest.clearAllMocks());

    test('product가 존재하면 댓글 목록을 반환한다', async () => {
        // given
        mockProductsRepo.getProduct.mockResolvedValue(mockProduct);
        mockCommentsRepo.getCommentList.mockResolvedValue(mockPaginationResult);

        // when
        const result = await getCommentListByProductId(1, paginationParams);

        // then
        expect(result).toEqual(mockPaginationResult);
    });

    test('product가 없으면 NotFoundError를 던진다', async () => {
        // given
        mockProductsRepo.getProduct.mockResolvedValue(null);

        // when & then
        await expect(getCommentListByProductId(999, paginationParams)).rejects.toThrow(NotFoundError);
    });

    test('commentsRepository가 올바른 인자로 호출된다', async () => {
        // given
        mockProductsRepo.getProduct.mockResolvedValue(mockProduct);
        mockCommentsRepo.getCommentList.mockResolvedValue(mockPaginationResult);

        // when
        await getCommentListByProductId(1, paginationParams);

        // then
        expect(mockCommentsRepo.getCommentList).toHaveBeenCalledWith({ productId: 1 }, paginationParams);
    });
});

// ----------------------------------------------------------------

describe('updateComment', () => {
    beforeEach(() => jest.clearAllMocks());

    test('comment가 없으면 NotFoundError를 던진다', async () => {
        // given
        mockCommentsRepo.getComment.mockResolvedValue(null);

        // when & then
        await expect(updateComment(999, 20, '수정 내용')).rejects.toThrow(NotFoundError);
    });

    test('댓글 작성자가 아니면 ForbiddenError를 던진다', async () => {
        // given - 댓글 작성자: userId 20
        mockCommentsRepo.getComment.mockResolvedValue(mockComment);

        // when & then - 다른 유저(userId 99)가 수정 시도
        await expect(updateComment(1, 99, '수정 내용')).rejects.toThrow(ForbiddenError);
    });

    test('댓글 작성자가 맞으면 댓글을 수정한다', async () => {
        // given
        const updatedComment = { ...mockComment, content: '수정된 댓글' };
        mockCommentsRepo.getComment.mockResolvedValue(mockComment); // 댓글 작성자: userId 20
        mockCommentsRepo.updateComment.mockResolvedValue(updatedComment);

        // when
        const result = await updateComment(1, 20, '수정된 댓글');

        // then
        expect(result).toEqual(updatedComment);
        expect(mockCommentsRepo.updateComment).toHaveBeenCalledWith(1, { content: '수정된 댓글' });
    });
});

// ----------------------------------------------------------------

describe('deleteComment', () => {
    beforeEach(() => jest.clearAllMocks());

    test('comment가 없으면 NotFoundError를 던진다', async () => {
        // given
        mockCommentsRepo.getComment.mockResolvedValue(null);

        // when & then
        await expect(deleteComment(999, 20)).rejects.toThrow(NotFoundError);
    });

    test('댓글 작성자가 아니면 ForbiddenError를 던진다', async () => {
        // given
        mockCommentsRepo.getComment.mockResolvedValue(mockComment); // 댓글 작성자: userId 20

        // when & then - 다른 유저(userId 99)가 삭제 시도
        await expect(deleteComment(1, 99)).rejects.toThrow(ForbiddenError);
    });

    test('댓글 작성자가 맞으면 댓글을 삭제한다', async () => {
        // given
        mockCommentsRepo.getComment.mockResolvedValue(mockComment); // 댓글 작성자: userId 20
        mockCommentsRepo.deleteComment.mockResolvedValue(mockComment);


        // when
        await deleteComment(1, 20);

        // then
        expect(mockCommentsRepo.deleteComment).toHaveBeenCalledWith(1);
    });
});