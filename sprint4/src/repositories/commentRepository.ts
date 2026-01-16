import { PrismaClient, Comment } from '@prisma/client';
import { CommentCreateData, CommentUpdateData } from '../dtos/commentDtos.js';
import { ICommentRepository } from './interfaces/ICommentRepository.js';

export class CommentRepository implements ICommentRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CommentCreateData & { userId: number }): Promise<Comment> {
    return this.prisma.comment.create({
      data,
    });
  }

  async findById(id: number): Promise<Comment | null> {
    return this.prisma.comment.findUnique({
      where: { id },
    });
  }

  async findManyByProductId(params: {
    productId: number;
    cursor?: number;
    limit: number;
  }): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      cursor: params.cursor ? { id: params.cursor } : undefined,
      take: params.limit,
      where: { productId: params.productId },
    });
  }

  async findManyByArticleId(params: {
    articleId: number;
    cursor?: number;
    limit: number;
  }): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      cursor: params.cursor ? { id: params.cursor } : undefined,
      take: params.limit,
      where: { articleId: params.articleId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: number, data: CommentUpdateData): Promise<Comment> {
    return this.prisma.comment.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Comment> {
    return this.prisma.comment.delete({
      where: { id },
    });
  }
}
