import { articleRepository } from '../../src/repositories/articleRepository';
import { articleService } from '../../src/services/articleService';

describe('Article Service', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('삭제 성공', async () => {
    jest.spyOn(articleRepository, 'findById').mockResolvedValue({
      id: 1,
      userId: 1,
    } as any);

    jest.spyOn(articleRepository, 'delete').mockResolvedValue({ id: 1 } as any);

    await articleService.deleteArticle(1, 1);

    expect(articleRepository.delete).toHaveBeenCalledWith(1);
  });
});
