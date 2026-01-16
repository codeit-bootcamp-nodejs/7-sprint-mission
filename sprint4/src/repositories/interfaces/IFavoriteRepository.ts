import { Favorite, Product } from '@prisma/client';

export type FavoriteWithProduct = Favorite & { 
  product: Product & { favorites: Favorite[] } 
};

export interface IFavoriteRepository {
  create(data: { productId: number; userId: number }): Promise<Favorite>;
  
  findByProductAndUser(productId: number, userId: number): Promise<Favorite | null>;
  
  findManyByUserId(userId: number, params: {
    skip: number;
    take: number;
    orderBy: 'desc' | 'asc';
    keyword?: string;
  }): Promise<FavoriteWithProduct[]>;
  
  countByUserId(userId: number, keyword?: string): Promise<number>;
  
  delete(id: number): Promise<Favorite>;
}
