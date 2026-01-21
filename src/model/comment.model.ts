import type { Comment as PrismaComment } from '@prisma/client';

class Comment {
  constructor(
    public id: string,
    public content: string,
    public createdAt: string,
  ) {}

  static fromEntity(entity: PrismaComment) {
    return new Comment(entity.id.toString(), entity.content, entity.createdAt.toISOString());
  }
}

export default Comment;
