import { prisma } from '../lib/prisma';
import { ArticleData } from '../lib/types/articleType';

export function createArticle({
    title,
    content,
    image,
    userId,
}: {
    title: string;
    content: string;
    image: string | null;
    userId: string;
}) {
    return prisma.article.create({
        data: {
            title,
            content,
            image,
            userId: BigInt(userId),
        },
    });
}

export function updateArticle({
    articleId,
    title,
    content,
    image,
}: {
    articleId: string;
    title?: string;
    content?: string;
    image?: string | null;
}) {
    return prisma.article.update({
        where: { id: BigInt(articleId) },
        data: {
            title,
            content,
            image,
        },
    });
}
export async function deleteArticle({ articleId, userId }: { articleId: string; userId: string }) {
    try {
        await prisma.article.delete({
            where: {
                id: BigInt(articleId),
                userId: BigInt(userId),
            },
        });
        return true;
    } catch (error) {
        return false;
    }
}

export async function findArticleById({
    articleId,
}: {
    articleId: string;
}): Promise<ArticleData | null> {
    return prisma.article.findUnique({
        where: {
            id: BigInt(articleId),
        },
    });
}

export async function findArticlesWithCount({
    page,
    pageSize,
    orderBy,
    where,
}: {
    page: number;
    pageSize: number;
    orderBy?: string;
    where?: any;
}) {
    const [totalCount, articleList] = await prisma.$transaction([
        prisma.article.count({ where }),
        prisma.article.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
            where,
        }),
    ]);
    return {
        totalCount,
        articleList,
    };
}
export async function findWithToggleLike({
    userId,
    articleId,
}: {
    userId: string;
    articleId: string;
}) {
    const existLike = await findArticleLikeById({ userId, articleId });
    if (existLike) {
        await deleteArticleLike({ articleId: existLike.id.toString() });
        return { isLiked: false };
    } else {
        await createArticleLike({ userId, articleId });
        return { isLiked: true };
    }
}
async function findArticleLikeById({ userId, articleId }: { userId: string; articleId: string }) {
    return prisma.articleLike.findUnique({
        where: {
            userId_articleId: { userId: BigInt(userId), articleId: BigInt(articleId) },
        },
    });
}
async function deleteArticleLike({ articleId }: { articleId: string }) {
    return prisma.articleLike.delete({
        where: { id: BigInt(articleId) },
    });
}

async function createArticleLike({ userId, articleId }: { userId: string; articleId: string }) {
    return prisma.articleLike.create({
        data: {
            userId: BigInt(userId),
            articleId: BigInt(articleId),
        },
    });
}

export async function findLikeArticlesWithCount({
    userId,
    skip,
    limit,
}: {
    userId: string;
    skip: number;
    limit: number;
}) {
    const [totalCount, likedArticles] = await Promise.all([
        findArticleLikesCount({ userId }),
        findArticleLikes({ userId, skip, limit }),
    ]);
    return {
        totalCount,
        likedArticles,
    };
}
async function findArticleLikesCount({ userId }: { userId: string }) {
    return prisma.articleLike.count({
        where: {
            userId: BigInt(userId),
        },
    });
}
async function findArticleLikes({
    userId,
    skip,
    limit,
}: {
    userId: string;
    skip: number;
    limit: number;
}) {
    return prisma.articleLike.findMany({
        where: { userId: BigInt(userId) },
        include: {
            article: true,
            user: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
        skip,
        take: limit,
    });
}
