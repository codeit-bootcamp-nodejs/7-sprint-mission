import { ArticleService } from '../service/article.service';
import { ArticleRepo } from '../repository/article.repository';
import Article from '../model/article.model';
import { NotFoundError } from '../errors/notFoundError';
import { ForbiddenError } from '../errors/forbiddenError';
import { CreateArticleDto, UpdateArticleDto } from '../types/article.type';
import { Article as PrismaArticle } from '@prisma/client';

interface PrismaLike {
  id: bigint;
  createdAt: Date;
  userId: bigint;
  articleId: bigint;
}

interface PrismaArticleWithLikes extends PrismaArticle {
  likes: PrismaLike[];
}

jest.mock('../repository/article.repository');

describe('ArticleService Unit Test', () => {
  let articleService: ArticleService;
  let mockRepo: jest.Mocked<ArticleRepo>;

  const userId = BigInt(1);
  const articleId = BigInt(100);

  const createMockPrismaArticle = (overrides?: Partial<PrismaArticle>): PrismaArticle =>
    ({
      id: articleId,
      title: '테스트 제목',
      content: '테스트 내용',
      image: null,
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    }) as PrismaArticle;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRepo = {
      findArticle: jest.fn(),
      getArticles: jest.fn(),
      getDetailArticle: jest.fn(),
      createArticle: jest.fn(),
      updateArticle: jest.fn(),
      deleteArticle: jest.fn(),
    } as unknown as jest.Mocked<ArticleRepo>;

    (ArticleRepo as jest.Mock).mockImplementation(() => mockRepo);
    articleService = new ArticleService();
  });

  describe('createArticle', () => {
    it('게시글 생성 시 Repository를 호출하고 Article 모델 인스턴스를 반환해야 한다', async () => {
      const dto: CreateArticleDto = { title: '새 제목', content: '새 내용' };
      const mockEntity = createMockPrismaArticle({ title: '새 제목' });

      const mockArticleInstance = new Article(
        '100',
        '새 제목',
        '새 내용',
        null,
        new Date().toISOString(),
      );

      mockRepo.createArticle.mockResolvedValue(mockEntity);
      jest.spyOn(Article, 'fromEntity').mockReturnValue(mockArticleInstance);

      const result = await articleService.createArticle(dto, userId);

      expect(mockRepo.createArticle).toHaveBeenCalledWith(userId, dto);
      expect(result).toBe(mockArticleInstance);
    });
  });

  describe('getArticles', () => {
    it('조회된 엔티티들을 Article 모델로 변환하여 반환해야 한다', async () => {
      const entityWithLikes: PrismaArticleWithLikes = {
        ...createMockPrismaArticle(),
        likes: [],
      };

      mockRepo.getArticles.mockResolvedValue({
        entities: [entityWithLikes] as unknown as (PrismaArticle & { likes: PrismaLike[] })[],
        totalCount: 1,
      });

      const result = await articleService.getArticles(1, 10, undefined, userId);

      expect(result.articles).toHaveLength(1);
      expect(result.totalCount).toBe(1);
    });
  });

  describe('getArticleDetail', () => {
    it('존재하지 않는 게시글 조회 시 NotFoundError를 던져야 한다', async () => {
      mockRepo.getDetailArticle.mockResolvedValue(null);

      await expect(articleService.getArticleDetail(articleId, userId)).rejects.toThrow(
        NotFoundError,
      );
    });

    it('게시글 상세 정보 조회 시 좋아요 여부를 정확히 판단해야 한다', async () => {
      // 에러 메시지가 요구하는 모든 필드를 갖춘 likes 객체
      const entityWithLikes: PrismaArticleWithLikes = {
        ...createMockPrismaArticle(),
        likes: [
          {
            id: BigInt(1),
            createdAt: new Date(),
            userId: userId,
            articleId: articleId,
          },
        ],
      };

      mockRepo.getDetailArticle.mockResolvedValue(
        entityWithLikes as unknown as PrismaArticle & { likes: PrismaLike[] },
      );

      const mockArticleInstance = new Article(
        '100',
        '제목',
        '내용',
        null,
        new Date().toISOString(),
      );
      jest.spyOn(Article, 'fromEntity').mockReturnValue(mockArticleInstance);

      const result = await articleService.getArticleDetail(articleId, userId);

      expect(result.article.isLiked).toBe(true);
    });
  });

  describe('updateArticle', () => {
    const updateDto: UpdateArticleDto = { title: '수정됨' };

    it('본인이 아닌 유저가 수정 시 ForbiddenError를 던져야 한다', async () => {
      mockRepo.findArticle.mockResolvedValue(createMockPrismaArticle({ userId: BigInt(999) }));

      await expect(articleService.updateArticle(articleId, userId, updateDto)).rejects.toThrow(
        ForbiddenError,
      );
    });

    it('본인 확인 후 정상적으로 수정된 모델을 반환해야 한다', async () => {
      const originalEntity = createMockPrismaArticle();
      const updatedEntity = createMockPrismaArticle({ title: '수정됨' });

      mockRepo.findArticle.mockResolvedValue(originalEntity);
      mockRepo.updateArticle.mockResolvedValue(updatedEntity);

      const mockArticleInstance = new Article(
        articleId.toString(),
        '수정됨',
        '테스트 내용',
        null,
        new Date().toISOString(),
      );
      jest.spyOn(Article, 'fromEntity').mockReturnValue(mockArticleInstance);

      const result = await articleService.updateArticle(articleId, userId, updateDto);

      expect(mockRepo.updateArticle).toHaveBeenCalledWith(articleId, updateDto);
      expect(result.title).toBe('수정됨');
    });
  });

  describe('deleteArticle', () => {
    it('본인 확인 후 Repository의 삭제 메서드를 호출해야 한다', async () => {
      mockRepo.findArticle.mockResolvedValue(createMockPrismaArticle());
      mockRepo.deleteArticle.mockResolvedValue(undefined as unknown as void);

      await articleService.deleteArticle(articleId, userId);

      expect(mockRepo.deleteArticle).toHaveBeenCalledWith(articleId);
    });
  });
});
