import { Article } from '@prisma/client';

export interface ArticleWithLikes extends Omit<Article, 'likes'> {
  likeCount: number;
  isLiked?: boolean;
}

export type ArticleCreateData = Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;

export type ArticleUpdateData = Partial<ArticleCreateData>;

export interface ArticleListResponse {
  list: ArticleWithLikes[];
  totalCount: number;
}
