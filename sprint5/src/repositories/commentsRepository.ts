import { prismaClient } from '../lib/prismaClient.js';

export const commentRepository = {
  async findById(id: number) {
    return await prismaClient.comment.findUnique({ where: { id } });
  },
  async create(data: any) {
    return await prismaClient.comment.create({ data });
  },
  async update(id: number, data: { content: string }) {
    return await prismaClient.comment.update({ where: { id }, data });
  },
  async delete(id: number) {
    return await prismaClient.comment.delete({ where: { id } });
  },
  async findManyByArticleId(articleId: number, options: any) {
    return await prismaClient.comment.findMany({
      where: { articleId },
      ...options,
      orderBy: { createdAt: 'desc' },
    });
  },
};
