import type { Article as PrismaArticle } from '@prisma/client';

class Article {
  constructor(
    public id: string,
    public title: string,
    public content: string,
    public image: string | null,
    public createdAt: string,
  ) {}

  static fromEntity(entity: PrismaArticle): Article {
    return new Article(
      entity.id.toString(),
      entity.title,
      entity.content,
      entity.image ?? null,
      entity.createdAt.toISOString(),
    );
  }
}

export default Article;
