import bcrypt from 'bcrypt';
import { IUserRepository } from '../repositories/interfaces/IUserRepository.js';
import { IProductRepository } from '../repositories/interfaces/IProductRepository.js';
import { IFavoriteRepository } from '../repositories/interfaces/IFavoriteRepository.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
import { UserResponse } from '../dtos/userDtos.js';
import { ProductListResponse } from '../dtos/productDtos.js';
import { UpdateMeInput, UpdatePasswordInput } from '../schemas/userSchemas.js';

export class UserService {
  constructor(
    private userRepository: IUserRepository,
    private productRepository: IProductRepository,
    private favoriteRepository: IFavoriteRepository
  ) {}

  async getMe(userId: number): Promise<UserResponse> {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new NotFoundError('user', userId);
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateMe(userId: number, data: UpdateMeInput): Promise<UserResponse> {
    const updatedUser = await this.userRepository.update(userId, data);
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async updatePassword(userId: number, data: UpdatePasswordInput): Promise<void> {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new NotFoundError('user', userId);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.newPassword, salt);

    await this.userRepository.updatePassword(userId, hashedPassword);
  }

  async getMyProducts(
    userId: number,
    page: number,
    pageSize: number,
    orderBy: string,
    keyword?: string
  ): Promise<ProductListResponse> {
    const order = orderBy === 'recent' ? 'desc' : 'asc';
    
    const [products, totalCount] = await Promise.all([
      this.productRepository.findManyByUserId(userId, {
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: order,
        keyword,
      }),
      this.productRepository.countByUserId(userId, keyword),
    ]);

    const productsWithFavorites = products.map((product) => ({
      ...product,
      favoriteCount: product.favorites?.length || 0,
      isFavorited: product.favorites?.some((fav: { userId: number }) => fav.userId === userId),
    }));

    return {
      list: productsWithFavorites,
      totalCount,
    };
  }

  async getMyFavorites(
    userId: number,
    page: number,
    pageSize: number,
    orderBy: string,
    keyword?: string
  ): Promise<ProductListResponse> {
    const order = orderBy === 'recent' ? 'desc' : 'asc';
    
    const [favorites, totalCount] = await Promise.all([
      this.favoriteRepository.findManyByUserId(userId, {
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: order,
        keyword,
      }),
      this.favoriteRepository.countByUserId(userId, keyword),
    ]);

    const productsWithFavorites = favorites.map((favorite) => ({
      ...favorite.product,
      favoriteCount: favorite.product.favorites?.length || 0,
      isFavorited: true,
    }));

    return {
      list: productsWithFavorites,
      totalCount,
    };
  }
}
