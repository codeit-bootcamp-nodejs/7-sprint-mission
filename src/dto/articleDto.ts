import { Article, User, Like } from '@prisma/client';

type ArticleWithRelations = Article & {
  user?: User;
  likes?: Like[];
  _count?: { likes: number; comments: number };
};

export function toArticleDto(article: ArticleWithRelations) {
  return {
    id: article.id,
    title: article.title,
    content: article.content,
    image: article.image,
    userId: article.userId,
    writer: article.user
      ? { id: article.user.id, nickname: article.user.nickname }
      : undefined,
    likeCount: article._count?.likes ?? article.likes?.length ?? 0,
    commentCount: article._count?.comments ?? 0,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  };
}
