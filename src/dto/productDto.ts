import { Product, User, Favorite } from '@prisma/client';

type ProductWithRelations = Product & {
  user?: User;
  favorites?: Favorite[];
  _count?: { favorites: number; comments: number };
};

export function toProductDto(product: ProductWithRelations) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    tags: product.tags,
    images: product.images,
    userId: product.userId,
    writer: product.user
      ? { id: product.user.id, nickname: product.user.nickname }
      : undefined,
    favoriteCount: product._count?.favorites ?? product.favorites?.length ?? 0,
    commentCount: product._count?.comments ?? 0,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}
