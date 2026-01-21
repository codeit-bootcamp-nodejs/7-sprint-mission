import { articleRepository } from '../repositories/articleRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import { CreateArticleBody, UpdateArticleBody } from '../structs/articlesStructs';
import { User } from '@prisma/client';

export const articleService = {
  async getArticle(id: number, user?: User) {
    const article = await articleRepository.findById(id);
    if (!article) {
      throw new NotFoundError('article', id);
    }

    let isLiked = false;
    if (user) {
      const like = await articleRepository.findLike(user.id, id);
      isLiked = !!like;
    }

    return { ...article, isLiked };
  },

  async getList(page: number, pageSize: number, orderBy: 'recent' | undefined, keyword?: string) {
    const skip = (page - 1) * pageSize;
    const [list, totalCount] = await Promise.all([
      articleRepository.findList(skip, pageSize, orderBy, keyword),
      articleRepository.count(keyword),
    ]);
    
    return { list, totalCount };
  },

  async createArticle(userId: number, data: CreateArticleBody) {
    return articleRepository.create(userId, data);
  },

  async updateArticle(userId: number, articleId: number, data: UpdateArticleBody) {
    const article = await articleRepository.findById(articleId);
    if (!article) {
      throw new NotFoundError('article', articleId);
    }

    if (article.userId !== userId) {
      throw new ForbiddenError('You are not allowed to update this article');
    }

    return articleRepository.update(articleId, data);
  },

  async deleteArticle(userId: number, articleId: number) {
    const article = await articleRepository.findById(articleId);
    if (!article) {
      throw new NotFoundError('article', articleId);
    }

    if (article.userId !== userId) {
      throw new ForbiddenError('You are not allowed to delete this article');
    }

    return articleRepository.delete(articleId);
  },
  
  async toggleLike(userId: number, articleId: number) {
      const article = await articleRepository.findById(articleId);
      if (!article) {
          throw new NotFoundError('article', articleId);
      }
      
      const existingLike = await articleRepository.findLike(userId, articleId);
      if (existingLike) {
          await articleRepository.removeLike(existingLike.id);
          return { isLiked: false };
      } else {
          await articleRepository.addLike(userId, articleId);
          return { isLiked: true };
      }
  }
};