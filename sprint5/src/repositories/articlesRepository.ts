import { prismaClient } from '../lib/prismaClient.js';
import type { Prisma } from '@prisma/client';

export const articleRepository = {
  async findById(id: number) {
    return await prismaClient.article.findUnique({
      where: { id },
      include: { likes: true },
    });
  },

  async findMany(options: { skip: number; take: number; orderBy: any; where: any }) {
    return await prismaClient.article.findMany({
      ...options,
      include: { likes: true },
    });
  },

  async count(where: any) {
    return await prismaClient.article.count({ where });
  },

  async create(data: Prisma.ArticleUncheckedCreateInput) {
    return await prismaClient.article.create({ data });
  },

  async update(id: number, data: Prisma.ArticleUpdateInput) {
    return await prismaClient.article.update({ where: { id }, data });
  },

  async delete(id: number) {
    return await prismaClient.article.delete({ where: { id } });
  },

  // Like 관련
  async findLike(articleId: number, userId: number) {
    return await prismaClient.like.findFirst({ where: { articleId, userId } });
  },

  async createLike(articleId: number, userId: number) {
    return await prismaClient.like.create({ data: { articleId, userId } });
  },

  async deleteLike(id: number) {
    return await prismaClient.like.delete({ where: { id } });
  },
};
