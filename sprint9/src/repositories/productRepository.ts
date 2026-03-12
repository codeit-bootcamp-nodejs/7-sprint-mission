import e from "express";
import { prismaClient } from "../lib/prismaClient";
import { Product } from "@prisma/client";

export async function createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  // Implementation for creating a product in the database
    const createdProduct = await prismaClient.product.create({data});
    return createdProduct;
}
export async function getProductWithFavorites(id: number) {
    const product = await prismaClient.product.findUnique({
        where: { id },
        include: {
            favorites: true
        }
    });
    return product;
}
export async function getProduct(id: number) {
    const product = await prismaClient.product.findUnique({
        where: { id }
    });
    return product;
}

export async function updateProductWithFavorites(id: number, data: Partial<Product>) {
    const updatedProduct = await prismaClient.product.update({
        where: { id },
        data,
        include: {
            favorites: true,
        },
    });
    return updatedProduct;
}

export async function deleteProduct(id: number) {
    await prismaClient.product.delete({
        where: { id }
    });
}   
export async function getProductList(params: {
    skip: number;
    take: number;
    orderBy: 'recent' | 'oldest';
    where?: object;
}) {
    const products = await prismaClient.product.findMany({
        skip: params.skip,
        take: params.take,
        orderBy: params.orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
        where: params.where,
        include: {
            favorites: true,
        },
    });
    return products;
} 
export async function countProducts(where?: object) {
    const count = await prismaClient.product.count({ where });
    return count;
} 
export async function createComment(data: {
    productId: number;
    userId: number;
    content: string;
}) {
    const createdComment = await prismaClient.comment.create({ data });
    return createdComment;
}
export async function getCommentList(params: {
    productId: number;
    cursor?: number;
    limit: number;
}) {
    const comments = await prismaClient.comment.findMany({
        cursor: params.cursor ? { id: params.cursor } : undefined,
        take: params.limit + 1,
        where: { productId: params.productId },
        orderBy: { id: 'asc' },
        include: {
            user: true,
        },
    });

    let nextCursor: number | undefined = undefined;
    if (comments.length > params.limit) {
        const nextItem = comments.pop();
        nextCursor = nextItem!.id;
    }

    return {
        list: comments,
        nextCursor,
    };
}
export async function createFavorite(data: {
    productId: number;
    userId: number;
}) {
    const createdFavorite = await prismaClient.favorite.create({ data });
    return createdFavorite;
}
export async function deleteFavorite(productId: number, userId: number) {
    await prismaClient.favorite.deleteMany({
        where: {
            productId,
            userId,
        },
    });
}
export async function getFavorite(productId: number, userId: number) {
    const favorite = await prismaClient.favorite.findFirst({
        where: {
            productId,
            userId,
        },
    });
    return favorite;
}

export async function getFavoritesByProductId(productId: number) {
    const favorites = await prismaClient.favorite.findMany({
        where: {
            productId,
        },
    });
    return favorites;
}   