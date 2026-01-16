import { Like } from '@prisma/client';

export interface ILikeRepository {
  create(data: { articleId: number; userId: number }): Promise<Like>;
  
  findByArticleAndUser(articleId: number, userId: number): Promise<Like | null>;
  
  delete(id: number): Promise<Like>;
}
