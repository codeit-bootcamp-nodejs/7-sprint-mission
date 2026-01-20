import NotFoundError from "../lib/errors/NotFoundError";
import * as userRepository from "../repositories/userRepository";
import UnauthorizedError from "../lib/errors/UnauthorizedError";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";

export async function getMe(userId: number) {   
    const user = await userRepository.getMe(userId);
    if (!user) {
      throw new NotFoundError('user', userId);
    }  
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

export async function updateMe(userId: number, data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>) {
    const updatedUser = await userRepository.updateUser(userId, data);
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
} 
export async function updateMyPassword(userId: number, password: string,newPassword: string) {
    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundError('user', userId);
    }       
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    return userRepository.updateUserPassword(userId, hashedPassword);
}
export async function getMyProductList(
    userId: number,
    params: {
        skip: number;
        take: number;
        orderBy: 'recent' | 'oldest';
        where?: object;
        userId?: number;
    }              
) {
    const products = await userRepository.getMyProductList(userId, params);
    const productsWithFavorites = products.map((product) => ({
    ...product,
    favorites: undefined,
    favoriteCount: product.favorites.length,
    isFavorited: product.favorites.some((favorite) => favorite.userId === params.userId),
  }));

  return productsWithFavorites;
}
export async function countMyProducts(userId: number, where?: object) {
   const count = userRepository.countMyProducts(userId, where);
   return count;
}

export async function getMyFavoriteList(
    userId: number,
    params: {
        skip: number;
        take: number;
        orderBy: 'recent' | 'oldest';
    }           
) {

    const favorites = await userRepository.getMyFavoriteList(userId, params);
    const productsWithFavorites = favorites.map((product) => ({
    ...product,
    favorites: undefined,
    favoriteCount: product.favorites.length,
    isFavorited: true,
  }));
   
  return productsWithFavorites;
}
export async function countMyFavorites(userId: number, where: { OR: ({ name: { contains: string; }; description?: undefined; } | { description: { contains: string; }; name?: undefined; })[]; } | { OR?: undefined; }) {
   const count = userRepository.countMyFavorites(userId);
   return count;
}   