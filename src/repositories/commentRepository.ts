import { prisma } from '../lib/prismaClient';
import { CreateCommentBody, UpdateCommentBody } from '../structs/commentsStruct';

export const commentRepository = {
  async findById(id: number) {
    return prisma.comment.findUnique({ where: { id } });
  },

  async create(userId: number, target: { articleId?: number; productId?: number }, data: CreateCommentBody) {
    return prisma.comment.create({
      data: {
        content: data.content,
        userId,
        ...target,
      },
    });
  },

  async findListByTarget(target: { articleId?: number; productId?: number }, cursor?: number, limit: number = 10) {
    return prisma.comment.findMany({
      cursor: cursor ? { id: cursor } : undefined,
      take: limit + 1,
      where: target,
      orderBy: { createdAt: 'desc' },
    });
  },

  async update(id: number, data: UpdateCommentBody) {
    return prisma.comment.update({
      where: { id },
      data,
    });
  },

  async delete(id: number) {
    return prisma.comment.delete({ where: { id } });
  },
};