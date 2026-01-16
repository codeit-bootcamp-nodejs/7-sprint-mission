import { Article, Like } from '@prisma/client';
import { ArticleCreateData, ArticleUpdateData } from '../../dtos/articleDtos.js';

export type ArticleWithLikes = Article & { likes?: Like[] };

export interface IArticleRepository {
  create(data: ArticleCreateData & { userId: number }): Promise<Article>;
  
  findById(id: number, includeRelations?: boolean): Promise<ArticleWithLikes | null>;
  
  findMany(params: {
    skip: number;
    take: number;
    orderBy: 'desc' | 'asc';
    keyword?: string;
    includeRelations?: boolean;
  }): Promise<ArticleWithLikes[]>;
  
  count(keyword?: string): Promise<number>;
  
  update(id: number, data: ArticleUpdateData): Promise<Article>;
  
  delete(id: number): Promise<Article>;
}
