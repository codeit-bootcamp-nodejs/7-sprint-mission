export type BaseCommentParam = {
    id: string;
    userId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
};

export type BaseCommentData = {
    id: bigint;
    userId: bigint;
    content: string;
    createdAt: Date;
    updatedAt: Date;
};

export type ArticleCommentParam = BaseCommentParam & { articleId: string };
export type ProductCommentParam = BaseCommentParam & { productId: string };

export type ArticleCommentData = BaseCommentData & { articleId: bigint };
export type ProductCommentData = BaseCommentData & { productId: bigint };

export type CommentParam = ArticleCommentParam | ProductCommentParam;
export type CommentData = ArticleCommentData | ProductCommentData;
