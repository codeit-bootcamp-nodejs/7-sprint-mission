import { Product } from '@prisma/client';
import { IProductRepository } from '../repositories/interfaces/IProductRepository.js';
import { IFavoriteRepository } from '../repositories/interfaces/IFavoriteRepository.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';
import BadRequestError from '../lib/errors/BadRequestError.js';
import { ProductWithFavorites, ProductListResponse } from '../dtos/productDtos.js';
import { CreateProductInput, UpdateProductInput } from '../schemas/productSchemas.js';

export class ProductService {
  constructor(
    private productRepository: IProductRepository,
    private favoriteRepository: IFavoriteRepository
  ) {}

  async createProduct(userId: number, data: CreateProductInput): Promise<Product> {
    return this.productRepository.create({
      ...data,
      userId,
    });
  }

  async getProduct(id: number, currentUserId?: number): Promise<ProductWithFavorites> {
    const product = await this.productRepository.findById(id, true);
    
    if (!product) {
      throw new NotFoundError('product', id);
    }

    const favorites = 'favorites' in product ? (product.favorites || []) : [];

    return {
      ...product,
      favoriteCount: Array.isArray(favorites) ? favorites.length : 0,
      isFavorited: currentUserId && Array.isArray(favorites)
        ? favorites.some((fav: { userId: number }) => fav.userId === currentUserId)
        : undefined,
    };
  }

  async updateProduct(
    id: number,
    userId: number,
    data: UpdateProductInput
  ): Promise<Product> {
    const existingProduct = await this.productRepository.findById(id);

    if (!existingProduct) {
      throw new NotFoundError('product', id);
    }

    if (existingProduct.userId !== userId) {
      throw new ForbiddenError('Should be the owner of the product');
    }

    return this.productRepository.update(id, data);
  }

  async deleteProduct(id: number, userId: number): Promise<void> {
    const existingProduct = await this.productRepository.findById(id);

    if (!existingProduct) {
      throw new NotFoundError('product', id);
    }

    if (existingProduct.userId !== userId) {
      throw new ForbiddenError('Should be the owner of the product');
    }

    await this.productRepository.delete(id);
  }

  async getProductList(
    page: number,
    pageSize: number,
    orderBy: string,
    keyword?: string,
    currentUserId?: number
  ): Promise<ProductListResponse> {
    const order = orderBy === 'recent' ? 'desc' : 'asc';
    
    const [products, totalCount] = await Promise.all([
      this.productRepository.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: order,
        keyword,
        includeRelations: true,
      }),
      this.productRepository.count(keyword),
    ]);

    const productsWithFavorites = products.map((product) => {
      const favorites = 'favorites' in product ? (product.favorites || []) : [];
      return {
        ...product,
        favoriteCount: Array.isArray(favorites) ? favorites.length : 0,
        isFavorited: currentUserId && Array.isArray(favorites)
          ? favorites.some((fav: { userId: number }) => fav.userId === currentUserId)
          : undefined,
      };
    });

    return {
      list: productsWithFavorites,
      totalCount,
    };
  }

  async createFavorite(productId: number, userId: number): Promise<void> {
    const product = await this.productRepository.findById(productId);
    
    if (!product) {
      throw new NotFoundError('product', productId);
    }

    const existingFavorite = await this.favoriteRepository.findByProductAndUser(
      productId,
      userId
    );

    if (existingFavorite) {
      throw new BadRequestError('Already favorited');
    }

    await this.favoriteRepository.create({ productId, userId });
  }

  async deleteFavorite(productId: number, userId: number): Promise<void> {
    const existingFavorite = await this.favoriteRepository.findByProductAndUser(
      productId,
      userId
    );

    if (!existingFavorite) {
      throw new BadRequestError('Not favorited');
    }

    await this.favoriteRepository.delete(existingFavorite.id);
  }
}
