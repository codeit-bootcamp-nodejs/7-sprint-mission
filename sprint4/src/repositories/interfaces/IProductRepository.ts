import { Product, Favorite } from '@prisma/client';
import { ProductCreateData, ProductUpdateData } from '../../dtos/productDtos.js';

export type ProductWithFavorites = Product & { favorites?: Favorite[] };

export interface IProductRepository {
  create(data: ProductCreateData & { userId: number }): Promise<Product>;
  
  findById(id: number, includeRelations?: boolean): Promise<ProductWithFavorites | null>;
  
  findMany(params: {
    skip: number;
    take: number;
    orderBy: 'desc' | 'asc';
    keyword?: string;
    includeRelations?: boolean;
  }): Promise<ProductWithFavorites[]>;
  
  findManyByUserId(userId: number, params: {
    skip: number;
    take: number;
    orderBy: 'desc' | 'asc';
    keyword?: string;
  }): Promise<ProductWithFavorites[]>;
  
  count(keyword?: string): Promise<number>;
  
  countByUserId(userId: number, keyword?: string): Promise<number>;
  
  update(id: number, data: ProductUpdateData): Promise<Product>;
  
  delete(id: number): Promise<Product>;
}
