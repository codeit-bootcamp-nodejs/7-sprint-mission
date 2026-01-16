import { PrismaClient, Like } from '@prisma/client';
import { ILikeRepository } from './interfaces/ILikeRepository.js';

export class LikeRepository implements ILikeRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: { articleId: number; userId: number }): Promise<Like> {
    return this.prisma.like.create({
      data,
    });
  }

  async findByArticleAndUser(articleId: number, userId: number): Promise<Like | null> {
    return this.prisma.like.findFirst({
      where: { articleId, userId },
    });
  }

  async delete(id: number): Promise<Like> {
    return this.prisma.like.delete({
      where: { id },
    });
  }
}
