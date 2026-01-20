import { articleRepository } from '../repositories/articlesRepository.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';
import BadRequestError from '../lib/errors/BadRequestError.js';
import { commentRepository } from '../repositories/commentsRepository.js';

export const articleService = {
  async getArticle(id: number, userId?: number) {
    const article = await articleRepository.findById(id);
    if (!article) throw new NotFoundError('article', id);

    return {
      ...article,
      likes: undefined,
      likeCount: article.likes.length,
      isLiked: userId ? article.likes.some((l) => l.userId === userId) : undefined,
    };
  },

  async getArticleList(query: any, userId?: number) {
    const { page, pageSize, orderBy, keyword } = query;
    const where = { title: keyword ? { contains: keyword } : undefined };

    const totalCount = await articleRepository.count(where);
    const articles = await articleRepository.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
      where,
    });

    const list = articles.map((article) => ({
      ...article,
      likes: undefined,
      likeCount: article.likes.length,
      isLiked: userId ? article.likes.some((l) => l.userId === userId) : undefined,
    }));

    return { list, totalCount };
  },

  async updateArticle(id: number, userId: number, data: any) {
    const article = await articleRepository.findById(id);
    if (!article) throw new NotFoundError('article', id);
    if (article.userId !== userId) throw new ForbiddenError('Should be the owner');

    return await articleRepository.update(id, data);
  },

  async deleteArticle(id: number, userId: number) {
    const article = await articleRepository.findById(id);
    if (!article) throw new NotFoundError('article', id);
    if (article.userId !== userId) throw new ForbiddenError('Should be the owner');

    await articleRepository.delete(id);
  },

  async toggleLike(articleId: number, userId: number, isCreate: boolean) {
    const article = await articleRepository.findById(articleId);
    if (!article) throw new NotFoundError('article', articleId);

    const existingLike = await articleRepository.findLike(articleId, userId);

    if (isCreate) {
      if (existingLike) throw new BadRequestError('Already liked');
      await articleRepository.createLike(articleId, userId);
    } else {
      if (!existingLike) throw new BadRequestError('Not liked');
      await articleRepository.deleteLike(existingLike.id);
    }
  },

  async createComment(articleId: number, userId: number, content: string) {
    const article = await articleRepository.findById(articleId);
    if (!article) throw new NotFoundError('article', articleId);

    return await commentRepository.create({ articleId, userId, content });
  },

  async getCommentList(articleId: number, query: any) {
    const { cursor, limit } = query;
    const article = await articleRepository.findById(articleId);
    if (!article) throw new NotFoundError('article', articleId);

    const commentsWithCursor = await commentRepository.findManyByArticleId(articleId, {
      cursor: cursor ? { id: cursor } : undefined,
      take: limit + 1,
    });

    const comments = commentsWithCursor.slice(0, limit);
    const cursorComment = commentsWithCursor[commentsWithCursor.length - 1];
    const nextCursor = cursorComment ? cursorComment.id : null;

    return { list: comments, nextCursor };
  },
};
