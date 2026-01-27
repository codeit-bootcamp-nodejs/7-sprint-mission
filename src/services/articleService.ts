import { Article } from '../classes/Article';
import * as articleRepository from '../repositories/articleRepository';
import { NotFoundError } from '../lib/errors/NotFoundError';
import { ForbiddenError } from '../lib/errors/ForbiddenError';

export async function createArticle({
    title,
    content,
    image,
    userId,
}: {
    title: string;
    content: string;
    image: string | null;
    userId: string;
}): Promise<Article> {
    const article = await articleRepository.createArticle({
        title,
        content,
        image,
        userId,
    });
    return Article.fromEntity(article);
}
export async function updateArticle({
    articleId,
    userId,
    title,
    content,
    image,
}: {
    articleId: string;
    userId: string;
    title?: string;
    content?: string;
    image?: string | null;
}) {
    const existingArticle = await articleRepository.findArticleById({ articleId });
    if (!existingArticle) {
        throw new NotFoundError('Article', Number(articleId));
    }
    if (existingArticle.userId.toString() !== userId) {
        throw new ForbiddenError('본인의 게시글만 수정/삭제할 수 있습니다.');
    }
    const updatedArticle = await articleRepository.updateArticle({
        articleId,
        title,
        content,
        image,
    });
    return Article.fromEntity(updatedArticle);
}
export async function deleteArticle({ articleId, userId }: { articleId: string; userId: string }) {
    const existingArticle = await articleRepository.findArticleById({ articleId });
    if (!existingArticle) {
        throw new NotFoundError('Article', Number(articleId));
    }
    if (existingArticle.userId.toString() !== userId) {
        throw new ForbiddenError('본인의 게시글만 수정/삭제할 수 있습니다.');
    }

    return await articleRepository.deleteArticle({ articleId, userId });
}
export async function getArticle({ articleId }: { articleId: string }) {
    const findArticle = await articleRepository.findArticleById({ articleId });
    if (!findArticle) {
        throw new NotFoundError('Article', Number(articleId));
    }
    return Article.fromEntity(findArticle);
}
export async function getArticleList({
    page,
    pageSize,
    orderBy,
    keyword,
}: {
    page: number;
    pageSize: number;
    orderBy?: string;
    keyword?: string;
}) {
    const where = {
        title: keyword ? { contains: keyword } : undefined,
    };

    const { articleList, totalCount } = await articleRepository.findArticlesWithCount({
        page,
        pageSize,
        orderBy,
        where,
    });

    return {
        articles: Article.fromEntityList(articleList),
        totalCount,
    };
}

export async function toggleArticleLike({
    articleId,
    userId,
}: {
    articleId: string;
    userId: string;
}) {
    const article = await articleRepository.findArticleById({ articleId });
    if (!article) {
        throw new NotFoundError('Article', Number(articleId));
    }
    return await articleRepository.findWithToggleLike({ userId, articleId });
}
export async function getMyLikedArticles({
    userId,
    limit,
    skip,
}: {
    userId: string;
    limit: number;
    skip: number;
}) {
    const { totalCount, likedArticles } = await articleRepository.findLikeArticlesWithCount({
        userId,
        skip,
        limit,
    });
    const articleList = likedArticles.map((item) => item.article);
    return {
        articles: Article.fromEntityList(articleList),
        totalCount,
    };
}
