import { Comment } from '@prisma/client';

export type CommentCreateData = Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;

export type CommentUpdateData = Partial<Pick<Comment, 'content'>>;

export interface CommentListResponse {
  list: Comment[];
  nextCursor: number | null;
}
