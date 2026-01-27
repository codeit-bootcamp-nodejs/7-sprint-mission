import { UserParam } from './authType';

export type ArticleParam = {
    id: string;
    title: string;
    content: string;
    image: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
};

export type ArticleData = {
    id: bigint;
    title: string;
    content: string;
    image: string | null;
    userId: bigint;
    createdAt: Date;
    updatedAt: Date;
};

export type ArticleLikeParams = {
    id: string;
    userId: string;
    articleId: string;
    createdAt: Date;
    updatedAt: Date;
    user: UserParam;
    article: ArticleParam;
};

export type CreateArticleInput = Pick<ArticleParam, 'title' | 'content' | 'image'>;

export type CreateArticleDataAndUserIdInput = CreateArticleInput & { userId: bigint };

export type UpdateArticleInput = Partial<CreateArticleInput>;

export type CreateArticleLikeInput = Pick<ArticleLikeParams, 'userId' | 'articleId'>;
