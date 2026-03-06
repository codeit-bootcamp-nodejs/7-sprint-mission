import { Comment, User } from '@prisma/client';

type CommentWithUser = Comment & { user?: User };

export function toCommentDto(comment: CommentWithUser) {
  return {
    id: comment.id,
    content: comment.content,
    productId: comment.productId,
    articleId: comment.articleId,
    userId: comment.userId,
    writer: comment.user
      ? { id: comment.user.id, nickname: comment.user.nickname, image: comment.user.image }
      : undefined,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
}
