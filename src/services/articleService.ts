import { Article } from '@prisma/client';
import * as   articleRepository from '../repositories/articleRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import ForbiddenError from '../lib/errors/ForbiddenError';
type CreatedArticleData = Omit<Article, 'id' | 'createdAt' | 'updatedAt'>;

export async function createArticle(data: CreatedArticleData){
    const createdArticle = await articleRepository.createArticle(data);    
    return {
        ...createdArticle,
        likeCount:0,
        isLiked:false,
    };
}
export async function getArticle(id:number,userId?:number) {
    
    const article = await articleRepository.getArticleWithLikes(id);
    if(!article){
        return new NotFoundError('Article not found',id);
    }
    return {
        ...article,
        likeCount: article.likes.length,
        isLiked: userId ? article.likes.some(like => like.userId === userId) : false
    };

}
export async function updateArticle(id:number, data:Partial<Article>, user?: { id: number }
){

    const existingArticle = await articleRepository.getArticle(id);
    if (!existingArticle) {
        throw new NotFoundError('article', id);
    }

    if (existingArticle.userId !== user?.id) {
        throw new ForbiddenError('Should be the owner of the article');
    }

    const updatedArticle = await articleRepository.updateArticle(id, data);
    return updatedArticle;
}   
export async function deleteArticle(id:number, user?: { id: number }) {

    const existingArticle = await articleRepository.getArticle(id);
    if (!existingArticle) {
        throw new NotFoundError('article', id);
    }

    if (existingArticle.userId !== user?.id) {
        throw new ForbiddenError('Should be the owner of the article');
    }

    await articleRepository.deleteArticle(id);
}
export async function getArticleList(params: {
    page: number;
    pageSize: number;
    orderBy: 'recent' | 'oldest';
    keyword?: string;
}, userId?: number) {

    const where = {
        title: params.keyword ? { contains: params.keyword } : undefined,
    };

    const totalCount = await articleRepository.countArticles(where);
    const articles = await articleRepository.getArticles({
        skip: (params.page - 1) * params.pageSize,
        take: params.pageSize,
        orderBy: params.orderBy,
        where,
    });

    const articlesWithLikes = articles.map((article) => ({
        ...article,
        likeCount: article.likes.length,
        isLiked: userId ? article.likes.some((like) => like.userId === userId) : false,
        likes: undefined,
    }));

    return {
        list: articlesWithLikes,
        totalCount,
    };
}
export async function countArticles(where?: object) {
    const count = await articleRepository.countArticles(where);
    return count;
}

export async function createComment(data: {
    articleId: number;
    content: string;
    userId: number;
}) {

    const existingArticle = await articleRepository.getArticle(data.articleId);
  if (!existingArticle) {
    throw new NotFoundError('article', data.articleId);
  }

    const createdComment = await articleRepository.createComment(data);
    return createdComment;
}
export async function getCommentList(params: {
    articleId: number;
    cursor?: number;
    limit: number;
}) {

    const article = await articleRepository.getArticle(params.articleId);
    if (!article) {
        throw new NotFoundError('article', params.articleId);
    }

    const commentsWithCursor = await articleRepository.getComments({
        articleId: params.articleId,
        cursor: params.cursor,
        limit: params.limit + 1,
    });

    const comments = commentsWithCursor.slice(0, params.limit);
    const cursorComment = commentsWithCursor[commentsWithCursor.length - 1];
    const nextCursor = cursorComment ? cursorComment.id : null;

    return {
        list: comments,
        nextCursor,
    };
}
export async function createLike(data: {
    articleId: number;
    userId: number;
}) {

    const existingArticle = await articleRepository.getArticleWithLikes(data.articleId);
    if (!existingArticle) {
        throw new NotFoundError('article', data.articleId);
    }

    const existingLike = existingArticle.likes.find(
        (like) => like.userId === data.userId
    );
    if (existingLike) {
        throw new ForbiddenError('Already liked');
    }

    await articleRepository.createLike(data);
}
export async function deleteLike(articleId: number, userId: number) {

    const existingArticle = await articleRepository.getArticleWithLikes(articleId);
    if (!existingArticle) {
        throw new NotFoundError('article', articleId);
    }

    const existingLike = existingArticle.likes.find(
        (like) => like.userId === userId
    );
    if (!existingLike) {
        throw new ForbiddenError('Not liked yet');
    }

    await articleRepository.deleteLike(articleId, userId);
}             