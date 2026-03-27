import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

const articleInclude = {
  author: { select: { id: true, nickname: true, image: true } },
  _count: { select: { likes: true } },
} as const;

export async function findArticles(params: {
  skip: number;
  take: number;
  keyword?: string;
}) {
  const where: Prisma.ArticleWhereInput = params.keyword
    ? {
        OR: [
          { title: { contains: params.keyword, mode: 'insensitive' } },
          { content: { contains: params.keyword, mode: 'insensitive' } },
        ],
      }
    : {};

  const [data, total] = await Promise.all([
    prisma.article.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: 'desc' },
      include: articleInclude,
    }),
    prisma.article.count({ where }),
  ]);

  return { data, total };
}

export async function findArticleById(id: number) {
  return prisma.article.findUnique({ where: { id }, include: articleInclude });
}

export async function createArticle(data: Prisma.ArticleCreateInput) {
  return prisma.article.create({ data, include: articleInclude });
}

export async function updateArticle(id: number, data: Prisma.ArticleUpdateInput) {
  return prisma.article.update({ where: { id }, data, include: articleInclude });
}

export async function deleteArticle(id: number) {
  return prisma.article.delete({ where: { id } });
}
