import { NotificationType, Product } from "@prisma/client";
import * as productRepository from "../repositories/productRepository";
import NotFoundError from "../lib/errors/NotFoundError";
import BadRequestError from "../lib/errors/BadRequestError";
type createdProductData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
import * as notificationsService from './notificationService';
import socketService from "./socketService";

export async function createProduct(data: createdProductData){
  // Implementation for creating a product in the database
    const createdProduct = await productRepository.createProduct(data);    
    return {
        ...createdProduct,
        favoriteCount:0,
        isFavorited:false,
    };
}
export async function getProduct (id: number,userId?:number) {

    const product = await productRepository.getProductWithFavorites(id);
    if(!product){
        return new NotFoundError('Product not found',id);
    }
    return {
        ...product,
        favoriteCount: product.favorites.length,
        isFavorited: userId ? product.favorites.some(favorite => favorite.userId === userId) : false
    };
}
export async function updateProduct(id: number, data: Partial<Product>, user?: { id: number }){

    const existingProduct = await productRepository.getProduct(id);
    if (!existingProduct) {
        throw new NotFoundError('product', id);
    }

    if (existingProduct.userId !== user?.id) {
        throw new BadRequestError('Should be the owner of the product');
    }
    const updatedProduct = await productRepository.updateProductWithFavorites(id, data);

    const previousPrice = existingProduct.price;
    const updatedPrice = updatedProduct.price;
    
    if (previousPrice !== updatedPrice) {
        // 가격이 변경된 경우에만 알림 생성
        const favorites = await productRepository.getFavoritesByProductId(id);
        const likedUserIds = favorites.map(favorite => favorite.userId);
        const notifications = likedUserIds.map(userId => ({
            userId,
            type: NotificationType.PRICE_CHANGED,
            payload: {
                productId: id,
                price:updatedPrice,
            },
        }));
        const createdNotifications = await notificationsService.createNotifications(notifications);
        for (const noti of createdNotifications) {
            socketService.sendNotification(noti);
        }
    }

    
    return updatedProduct;
}   
export async function deleteProduct(id: number, user?: { id: number }) {

    const existingProduct = await productRepository.getProduct(id);
    if (!existingProduct) {
        throw new NotFoundError('product', id);
    }

    if (existingProduct.userId !== user?.id) {
        throw new BadRequestError('Should be the owner of the product');
    }

    await productRepository.deleteProduct(id);
} 
export async function getProductList(params: {
    page: number;
    pageSize: number;
    orderBy: 'recent' | 'oldest';
    keyword?: string;
    userId?: number;
}) {

    const where = params.keyword
    ? {
        OR: [
            { name: { contains: params.keyword } },
            { description: { contains: params.keyword } }
        ],
      }
    : undefined;

    const products = await productRepository.getProductList({
        skip: (params.page - 1) * params.pageSize,
        take: params.pageSize,
        orderBy: params.orderBy,
        where,
    });

    const productsWithFavorites = products.map((product) => ({
        ...product,
        favorites: undefined,
        favoriteCount: product.favorites.length,
        isFavorited: params.userId
        ? product.favorites.some((favorite) => favorite.userId === params.userId)
        : undefined,
    }));

    return productsWithFavorites;
} 
export async function countProducts(where?: object) {
    const count = await productRepository.countProducts(where);
    return count;
} 
export async function createComment(data: {
    productId: number;
    userId: number;
    content: string;
}) {
    const existingProduct = await productRepository.getProduct(data.productId);
    if (!existingProduct) {
        throw new NotFoundError('product', data.productId);
    }

    const createdComment = await productRepository.createComment(data);
    return createdComment;
}
export async function getCommentList(params: {
    productId: number;
    cursor?: number;
    limit: number;
}) {

    const existingProduct = await productRepository.getProduct(params.productId);
    if (!existingProduct) {
        throw new NotFoundError('product', params.productId);
    }       
    const comments = await productRepository.getCommentList(params);
    return comments;
} 

export async function createFavorite(data: {
    productId: number;
    userId: number;
}) {


    const existingProduct = await productRepository.getProduct(data.productId);
    if (!existingProduct) {
        throw new NotFoundError('product', data.productId);
    }
    const existingFavorite = await productRepository.getFavorite(data.productId, data.userId);
    if (existingFavorite) {
        throw new BadRequestError('Favorite already exists for this user and product');
    }    
    const createdFavorite = await productRepository.createFavorite(data);
    return createdFavorite;
}
export async function deleteFavorite(productId: number, userId: number) {
    
    const existingFavorite = await productRepository.getFavorite(productId, userId);
    if (!existingFavorite) {
        throw new BadRequestError('Not favorited');
    }
    await productRepository.deleteFavorite(productId, userId);
}          