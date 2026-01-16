import { Comment } from '@prisma/client';
import { CommentCreateData, CommentUpdateData } from '../../dtos/commentDtos.js';

export interface ICommentRepository {
  create(data: CommentCreateData & { userId: number }): Promise<Comment>;
  
  findById(id: number): Promise<Comment | null>;
  
  findManyByProductId(params: {
    productId: number;
    cursor?: number;
    limit: number;
  }): Promise<Comment[]>;
  
  findManyByArticleId(params: {
    articleId: number;
    cursor?: number;
    limit: number;
  }): Promise<Comment[]>;
  
  update(id: number, data: CommentUpdateData): Promise<Comment>;
  
  delete(id: number): Promise<Comment>;
}
