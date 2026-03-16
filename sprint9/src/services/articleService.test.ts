import { prismaClient } from '../lib/prismaClient';
import * as articleService from './articleService';

describe('Article Service', () => {
  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  describe('인증이 필요 없는 게시글 API', () => {
    test('게시글 목록을 가져올 수 있다.', async () => {
      const result = await articleService.getArticleList({
        page: 1,
        pageSize: 10,
        orderBy: 'recent',
        
      });
      expect(Array.isArray(result.list)).toBe(true);
    });

    test('게시글 상세 정보를 가져올 수 있다.', async () => {
      const articleId = 1; // 테스트용 게시글 ID
      const article = await articleService.getArticle(articleId);
      expect(article).toHaveProperty('id', articleId);
      expect(article).toHaveProperty('title');
      expect(article).toHaveProperty('content');
    });
  });

  describe('인증이 필요한 게시글 API', () => {
    test('게시글을 생성할 수 있다.', async () => {
      const newArticle = {
        title: '테스트 게시글',
        content: '테스트용 게시글입니다.',
        userId: 1,
        image: 'test-image.jpg',
      };
      const createdArticle = await articleService.createArticle(newArticle);
      expect(createdArticle).toHaveProperty('id');
      expect(createdArticle).toHaveProperty('title', newArticle.title);
      expect(createdArticle).toHaveProperty('content', newArticle.content);
    });

    test('게시글을 수정할 수 있다.', async () => {
      // 먼저 테스트용 게시글을 생성하여 해당 유저(소유자)로 만듭니다.
      const newArticle = {
        title: '업데이트용 게시글',
        content: '업데이트 테스트용 게시글입니다.',
        userId: 1,
        image: 'update-image.jpg',
      };
      const createdArticle = await articleService.createArticle(newArticle);
      const articleId = createdArticle.id;

      const updatedData = {
        title: '수정된 게시글 제목',
        content: '수정된 게시글 내용',
        userId: createdArticle.userId,
      };
      const updatedArticle = await articleService.updateArticle(articleId, updatedData);
      expect(updatedArticle).toHaveProperty('id', articleId);
      expect(updatedArticle).toHaveProperty('title', updatedData.title);
      expect(updatedArticle).toHaveProperty('content', updatedData.content);
      expect(updatedArticle).toHaveProperty('userId', updatedData.userId);

      // 정리: 생성한 테스트용 게시글 삭제
      await articleService.deleteArticle(articleId);
    });

    test('게시글을 삭제할 수 있다.', async () => {
      const articleId = 1; // 테스트용 게시글 ID
      const deleteResult = await articleService.deleteArticle(articleId);
      expect(deleteResult).toBe(true);
    });
  });
});
