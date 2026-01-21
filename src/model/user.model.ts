import type { User as PrismaUser } from '@prisma/client';

export default class User {
  constructor(
    public id: string,
    public email: string,
    public nickname: string,
    public image: string | null,
    public createdAt: string,
  ) {}

  static fromEntity(entity: PrismaUser) {
    return new User(
      entity.id.toString(),
      entity.email,
      entity.nickname,
      entity.image ?? null,
      entity.createdAt.toISOString(),
    );
  }
}
