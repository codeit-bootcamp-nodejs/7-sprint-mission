import { prisma } from '../lib/prismaClient';
import { CreateArticleBody, UpdateArticleBody } from '../structs/articlesStructs';

export const articleRepository = {
  async findById(id: number) {
    return prisma.article.findUnique({
      where: { id },
      include: { _count: { select: { likes: true } } },
    });
  },

  async findList(skip: number, take: number, orderBy: 'recent' | undefined, keyword?: string) {
    const where = keyword ? { title: { contains: keyword } } : undefined;
    return prisma.article.findMany({
      skip,
      take,
      orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
      where,
    });
  },

  async count(keyword?: string) {
    const where = keyword ? { title: { contains: keyword } } : undefined;
    return prisma.article.count({ where });
  },

  async create(userId: number, data: CreateArticleBody) {
    return prisma.article.create({
      data: { ...data, userId },
    });
  },

  async update(id: number, data: UpdateArticleBody) {
    return prisma.article.update({
      where: { id },
      data,
    });
  },

  async delete(id: number) {
    return prisma.article.delete({ where: { id } });
  },
  
  async findLike(userId: number, articleId: number) {
      return prisma.articleLike.findUnique({ where: { userId_articleId: { userId, articleId } } });
  },
  
  async addLike(userId: number, articleId: number) {
      return prisma.articleLike.create({ data: { userId, articleId } });
  },
  
  async removeLike(id: number) {
      return prisma.articleLike.delete({ where: { id } });
  }
};