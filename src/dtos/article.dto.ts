export interface ArticleResponseDto {
  id: number;
  title: string;
  content: string;
  likeCount: number;
  isLiked: boolean;
  authorId: number;
  author: { id: number; nickname: string; image: string | null };
  createdAt: Date;
  updatedAt: Date;
}

export function toArticleDto(
  article: {
    id: number;
    title: string;
    content: string;
    authorId: number;
    createdAt: Date;
    updatedAt: Date;
    author: { id: number; nickname: string; image: string | null };
    _count: { likes: number };
  },
  isLiked = false
): ArticleResponseDto {
  return {
    id: article.id,
    title: article.title,
    content: article.content,
    likeCount: article._count.likes,
    isLiked,
    authorId: article.authorId,
    author: article.author,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  };
}
