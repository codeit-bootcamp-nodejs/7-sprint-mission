import { Article } from '@prisma/client';
import { IArticleRepository } from '../repositories/interfaces/IArticleRepository.js';
import { ILikeRepository } from '../repositories/interfaces/ILikeRepository.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';
import BadRequestError from '../lib/errors/BadRequestError.js';
import { ArticleWithLikes, ArticleListResponse } from '../dtos/articleDtos.js';
import { CreateArticleInput, UpdateArticleInput } from '../schemas/articleSchemas.js';

export class ArticleService {
  constructor(
    private articleRepository: IArticleRepository,
    private likeRepository: ILikeRepository
  ) {}

  async createArticle(userId: number, data: CreateArticleInput): Promise<Article> {
    return this.articleRepository.create({
      title: data.title,
      content: data.content,
      image: data.image ?? null,
      userId,
    });
  }

  async getArticle(id: number, currentUserId?: number): Promise<ArticleWithLikes> {
    const article = await this.articleRepository.findById(id, true);
    
    if (!article) {
      throw new NotFoundError('article', id);
    }

    const likes = 'likes' in article ? (article.likes || []) : [];

    return {
      ...article,
      likeCount: Array.isArray(likes) ? likes.length : 0,
      isLiked: currentUserId && Array.isArray(likes)
        ? likes.some((like: { userId: number }) => like.userId === currentUserId)
        : undefined,
    };
  }

  async updateArticle(
    id: number,
    userId: number,
    data: UpdateArticleInput
  ): Promise<Article> {
    const existingArticle = await this.articleRepository.findById(id);

    if (!existingArticle) {
      throw new NotFoundError('article', id);
    }

    if (existingArticle.userId !== userId) {
      throw new ForbiddenError('Should be the owner of the article');
    }

    return this.articleRepository.update(id, data);
  }

  async deleteArticle(id: number, userId: number): Promise<void> {
    const existingArticle = await this.articleRepository.findById(id);

    if (!existingArticle) {
      throw new NotFoundError('article', id);
    }

    if (existingArticle.userId !== userId) {
      throw new ForbiddenError('Should be the owner of the article');
    }

    await this.articleRepository.delete(id);
  }

  async getArticleList(
    page: number,
    pageSize: number,
    orderBy: string,
    keyword?: string,
    currentUserId?: number
  ): Promise<ArticleListResponse> {
    const order = orderBy === 'recent' ? 'desc' : 'asc';
    
    const [articles, totalCount] = await Promise.all([
      this.articleRepository.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: order,
        keyword,
        includeRelations: true,
      }),
      this.articleRepository.count(keyword),
    ]);

    const articlesWithLikes = articles.map((article) => {
      const likes = 'likes' in article ? (article.likes || []) : [];
      return {
        ...article,
        likeCount: Array.isArray(likes) ? likes.length : 0,
        isLiked: currentUserId && Array.isArray(likes)
          ? likes.some((like: { userId: number }) => like.userId === currentUserId)
          : undefined,
      };
    });

    return {
      list: articlesWithLikes,
      totalCount,
    };
  }

  async createLike(articleId: number, userId: number): Promise<void> {
    const article = await this.articleRepository.findById(articleId);
    
    if (!article) {
      throw new NotFoundError('article', articleId);
    }

    const existingLike = await this.likeRepository.findByArticleAndUser(
      articleId,
      userId
    );

    if (existingLike) {
      throw new BadRequestError('Already liked');
    }

    await this.likeRepository.create({ articleId, userId });
  }

  async deleteLike(articleId: number, userId: number): Promise<void> {
    const article = await this.articleRepository.findById(articleId);
    
    if (!article) {
      throw new NotFoundError('article', articleId);
    }

    const existingLike = await this.likeRepository.findByArticleAndUser(
      articleId,
      userId
    );

    if (!existingLike) {
      throw new BadRequestError('Not liked');
    }

    await this.likeRepository.delete(existingLike.id);
  }
}
