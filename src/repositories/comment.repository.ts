import { prisma } from '../lib/prisma';

const commentAuthorSelect = {
  author: { select: { id: true, nickname: true, image: true } },
} as const;

export async function createProductComment(data: {
  content: string;
  authorId: number;
  productId: number;
}) {
  return prisma.productComment.create({ data, include: commentAuthorSelect });
}

export async function createArticleComment(data: {
  content: string;
  authorId: number;
  articleId: number;
}) {
  return prisma.articleComment.create({ data, include: commentAuthorSelect });
}

export async function findProductComments(productId: number, cursor: number | undefined, limit: number) {
  return prisma.productComment.findMany({
    where: { productId },
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    take: limit + 1,
    orderBy: { createdAt: 'desc' },
    include: commentAuthorSelect,
  });
}

export async function findArticleComments(articleId: number, cursor: number | undefined, limit: number) {
  return prisma.articleComment.findMany({
    where: { articleId },
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    take: limit + 1,
    orderBy: { createdAt: 'desc' },
    include: commentAuthorSelect,
  });
}

export async function findProductCommentById(id: number) {
  return prisma.productComment.findUnique({ where: { id }, include: commentAuthorSelect });
}

export async function findArticleCommentById(id: number) {
  return prisma.articleComment.findUnique({ where: { id }, include: commentAuthorSelect });
}

export async function updateProductComment(id: number, content: string) {
  return prisma.productComment.update({ where: { id }, data: { content }, include: commentAuthorSelect });
}

export async function updateArticleComment(id: number, content: string) {
  return prisma.articleComment.update({ where: { id }, data: { content }, include: commentAuthorSelect });
}

export async function deleteProductComment(id: number) {
  return prisma.productComment.delete({ where: { id } });
}

export async function deleteArticleComment(id: number) {
  return prisma.articleComment.delete({ where: { id } });
}
