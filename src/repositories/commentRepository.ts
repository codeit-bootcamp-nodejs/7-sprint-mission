import { prisma } from '../lib/prisma';
import { CommentData } from '../lib/types/commentType';

export async function findCommentById(
    id: string,
    target: 'Product' | 'Article',
): Promise<CommentData | null> {
    if (target === 'Product') {
        return prisma.productComment.findUnique({ where: { id: BigInt(id) } });
    } else {
        return prisma.articleComment.findUnique({ where: { id: BigInt(id) } });
    }
}

export async function createComment({
    id,
    content,
    userId,
    target,
}: {
    id: string;
    content: string;
    userId: string;
    target: 'Product' | 'Article';
}): Promise<CommentData> {
    if (target === 'Product') {
        return prisma.productComment.create({
            data: {
                productId: BigInt(id),
                userId: BigInt(userId),
                content,
            },
        });
    } else {
        return prisma.articleComment.create({
            data: {
                articleId: BigInt(id),
                userId: BigInt(userId),
                content,
            },
        });
    }
}

export async function updateComment(
    id: string,
    targetId: string,
    userId: string,
    content: string,
    target: 'Product' | 'Article',
): Promise<CommentData> {
    if (target === 'Product') {
        return prisma.productComment.update({
            where: {
                id: BigInt(id),
                userId: BigInt(userId),
                productId: BigInt(targetId),
            },
            data: { content },
        });
    } else {
        return prisma.articleComment.update({
            where: {
                id: BigInt(id),
                userId: BigInt(userId),
                articleId: BigInt(targetId),
            },
            data: {
                content,
            },
        });
    }
}

export async function deleteComment(
    id: string,
    targetId: string,
    userId: string,
    target: string,
): Promise<boolean> {
    try {
        if (target === 'Product') {
            await prisma.productComment.delete({
                where: {
                    id: BigInt(id),
                    userId: BigInt(userId),
                    productId: BigInt(targetId),
                },
            });
        } else {
            await prisma.articleComment.delete({
                where: {
                    id: BigInt(id),
                    userId: BigInt(userId),
                    articleId: BigInt(targetId),
                },
            });
        }
        return true;
    } catch (err) {
        return false;
    }
}

export async function findAllComments({
    cursor,
    limit,
    id,
    target,
}: {
    cursor: string;
    limit: number;
    id: string;
    target: 'Product' | 'Article';
}): Promise<CommentData[]> {
    if (target === 'Product') {
        return prisma.productComment.findMany({
            cursor: cursor ? { id: BigInt(cursor) } : undefined,
            take: limit + 1,
            where: {
                productId: BigInt(id),
            },
        });
    } else {
        return prisma.articleComment.findMany({
            cursor: cursor ? { id: BigInt(cursor) } : undefined,
            take: limit + 1,
            where: {
                articleId: BigInt(id),
            },
        });
    }
}
