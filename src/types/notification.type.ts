import { Type, TargetType } from '@prisma/client';

export interface Notificationparams {
  notificationId: bigint;
}

export interface CreateNotificationDto {
  userId: bigint;
  type: Type;
  targetId: bigint | null;
  targetType: TargetType | null;
  message: string;
}

export interface ArticleCommentCreatedEvent {
  article: {
    userId: bigint;
    title: string;
  };
  articleId: bigint;
}

export interface ProductCommentCreatedEvent {
  product: {
    userId: bigint;
    name: string;
  };
  productId: bigint;
}

export interface ProductPriceChangedEvent {
  product: {
    productId: bigint;
    name: string;
    price: number;
  };
}
