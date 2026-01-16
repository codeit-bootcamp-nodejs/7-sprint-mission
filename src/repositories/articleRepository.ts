import { prismaClient } from '../lib/prismaClient';
import { Article } from '@prisma/client';

export async function createArticle(data: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Promise<Article> {  
    const createdArticle = await prismaClient.article.create({data});
    return createdArticle;

} 
export async function getArticleWithLikes(id: number) {
    const article = await prismaClient.article.findUnique({
        where: { id },
        include: {
            likes: true
        }
    });
    return article;
}
export async function getArticle(id: number) {
    const article = await prismaClient.article.findUnique({
        where: { id }
    });
    return article;
}
export async function updateArticle(id: number, data: Partial<Article>) {
    const updatedArticle = await prismaClient.article.update({
        where: { id },
        data
    });
    return updatedArticle;
}

export async function deleteArticle(id: number) {
    await prismaClient.article.delete({
        where: { id }
    });
}

export async function getArticles(params: {
    skip: number;
    take: number;
    orderBy: 'recent' | 'oldest';
    where?: object;
}) {
    const articles = await prismaClient.article.findMany({
        skip: params.skip,
        take: params.take,
        orderBy: params.orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
        where: params.where,
        include: {
            likes: true,
        },
    });
    return articles;
}

export async function countArticles(where?: object) {
    const count = await prismaClient.article.count({ where });
    return count;
}
export async function createComment(data: {
    articleId: number;
    content: string;
    userId: number;
}) {
    const createdComment = await prismaClient.comment.create({
        data
    });
    return createdComment;
}

export async function getComments(params: {
    articleId: number;
    cursor?: number;
    limit: number;
}) {
    const comments = await prismaClient.comment.findMany({
        cursor: params.cursor ? { id: params.cursor } : undefined,
        take: params.limit,
        where: { articleId: params.articleId },
        orderBy: { createdAt: 'desc' },
    });
    return comments;
}

export async function countComments(articleId: number) {
    const count = await prismaClient.comment.count({
        where: { articleId }
    });
    return count;
} 

export async function createLike(data: {
    articleId: number;
    userId: number;
}) {
    const createdLike = await prismaClient.like.create({
        data
    });
    return createdLike;
}  
export async function deleteLike(articleId: number, userId: number) {
    await prismaClient.like.deleteMany({
        where: {
            articleId,
            userId,
        }
    });
}

export async function getLike(articleId: number, userId: number) {
    const like = await prismaClient.like.findFirst({
        where: {
            articleId,
            userId,
        }
    });
    return like;
}    