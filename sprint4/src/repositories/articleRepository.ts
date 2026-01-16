import { PrismaClient, Article } from '@prisma/client';
import { ArticleCreateData, ArticleUpdateData } from '../dtos/articleDtos.js';
import { IArticleRepository } from './interfaces/IArticleRepository.js';

export class ArticleRepository implements IArticleRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: ArticleCreateData & { userId: number }): Promise<Article> {
    return this.prisma.article.create({
      data,
    });
  }

  async findById(id: number, includeRelations = false) {
    return this.prisma.article.findUnique({
      where: { id },
      include: includeRelations ? { likes: true } : undefined,
    });
  }

  async findMany(params: {
    skip: number;
    take: number;
    orderBy: 'desc' | 'asc';
    keyword?: string;
    includeRelations?: boolean;
  }) {
    const where = params.keyword
      ? { title: { contains: params.keyword } }
      : undefined;

    return this.prisma.article.findMany({
      skip: params.skip,
      take: params.take,
      orderBy: params.orderBy === 'desc' ? { createdAt: 'desc' } : { id: 'asc' },
      where,
      include: params.includeRelations ? { likes: true } : undefined,
    });
  }

  async count(keyword?: string): Promise<number> {
    const where = keyword ? { title: { contains: keyword } } : undefined;
    return this.prisma.article.count({ where });
  }

  async update(id: number, data: ArticleUpdateData): Promise<Article> {
    return this.prisma.article.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Article> {
    return this.prisma.article.delete({
      where: { id },
    });
  }
}
