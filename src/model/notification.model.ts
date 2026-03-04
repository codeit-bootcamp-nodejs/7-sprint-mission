import { Notification as PrismaNotification } from '@prisma/client';

export class NotificationList {
  constructor(
    public id: string,
    public userId: string,
    public type: string,
    public targetId: string | null,
    public targetType: string | null,
    public message: string,
    public isRead: boolean,
    public createdAt: string,
  ) {}
  static fromEntity(entity: PrismaNotification) {
    return new NotificationList(
      entity.id.toString(),
      entity.userId.toString(),
      entity.type,
      entity.targetId ? entity.targetId.toString() : null,
      entity.targetType ? String(entity.targetType) : null,
      entity.message,
      entity.isRead,
      entity.createdAt.toISOString(),
    );
  }
}
