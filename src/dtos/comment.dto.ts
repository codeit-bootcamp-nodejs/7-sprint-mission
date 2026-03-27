export interface CommentResponseDto {
  id: number;
  content: string;
  authorId: number;
  author: { id: number; nickname: string; image: string | null };
  createdAt: Date;
  updatedAt: Date;
}

export function toCommentDto(comment: {
  id: number;
  content: string;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  author: { id: number; nickname: string; image: string | null };
}): CommentResponseDto {
  return {
    id: comment.id,
    content: comment.content,
    authorId: comment.authorId,
    author: comment.author,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
}
