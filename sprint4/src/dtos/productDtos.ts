import { Product } from '@prisma/client';

export interface ProductWithFavorites extends Omit<Product, 'favorites'> {
  favoriteCount: number;
  isFavorited?: boolean;
}

export type ProductCreateData = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;

export type ProductUpdateData = Partial<ProductCreateData>;

export interface ProductListResponse {
  list: ProductWithFavorites[];
  totalCount: number;
}
