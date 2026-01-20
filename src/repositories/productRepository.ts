import { prisma } from '../lib/prisma';

import { CreateProductInput, ProductData } from '../lib/types/productType';

export function createProduct({
    name,
    description,
    price,
    tags,
    images,
    userId,
}: CreateProductInput): Promise<ProductData> {
    return prisma.product.create({
        data: {
            name,
            description,
            price,
            tags,
            images,
            userId: BigInt(userId),
        },
    });
}
export function updateProduct({
    productId,
    name,
    description,
    price,
    tags,
    images,
}: {
    productId: string;
    name?: string;
    description?: string;
    price?: number;
    tags?: string[];
    images?: string[];
}) {
    return prisma.product.update({
        where: { id: BigInt(productId) },
        data: { name, description, price, tags, images },
    });
}
export async function deleteProduct({ productId, userId }: { productId: string; userId: string }) {
    try {
        await prisma.product.delete({
            where: {
                id: BigInt(productId),
                userId: BigInt(userId),
            },
        });
        return true;
    } catch (e) {
        return false;
    }
}

export async function findProductById({
    productId,
}: {
    productId: string;
}): Promise<ProductData | null> {
    return prisma.product.findUnique({
        where: { id: BigInt(productId) },
    });
}
export async function findProductsWithCount({
    page,
    pageSize,
    orderBy,
    where,
}: {
    page: number;
    pageSize: number;
    orderBy?: string;
    where?: any;
}) {
    const [totalCount, productList] = await prisma.$transaction([
        prisma.product.count({ where }),
        prisma.product.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
            where,
        }),
    ]);
    return {
        totalCount,
        productList,
    };
}

export async function findWithToggleLike({
    userId,
    productId,
}: {
    userId: string;
    productId: string;
}) {
    const existLike = await findProductLikeById({ userId, productId });
    if (existLike) {
        await deleteProductLike({ productId: existLike.id.toString() });
        return { isLiked: false };
    } else {
        await createProductLike({ userId, productId });
        return { isLiked: true };
    }
}
async function findProductLikeById({ userId, productId }: { userId: string; productId: string }) {
    return prisma.productLike.findUnique({
        where: {
            userId_productId: { userId: BigInt(userId), productId: BigInt(productId) },
        },
    });
}

async function deleteProductLike({ productId }: { productId: string }) {
    return prisma.productLike.delete({
        where: { id: BigInt(productId) },
    });
}

async function createProductLike({ userId, productId }: { userId: string; productId: string }) {
    return prisma.productLike.create({
        data: {
            userId: BigInt(userId),
            productId: BigInt(productId),
        },
    });
}

export async function findLikeProductsWithCount({
    userId,
    skip,
    limit,
}: {
    userId: string;
    skip: number;
    limit: number;
}) {
    const [totalCount, likedProducts] = await Promise.all([
        findProductLikesCount({ userId }),
        findProductLikes({ userId, skip, limit }),
    ]);
    return {
        totalCount,
        likedProducts,
    };
}

async function findProductLikesCount({ userId }: { userId: string }) {
    return prisma.productLike.count({
        where: {
            userId: BigInt(userId),
        },
    });
}

async function findProductLikes({
    userId,
    skip,
    limit,
}: {
    userId: string;
    skip: number;
    limit: number;
}) {
    return prisma.productLike.findMany({
        where: { userId: BigInt(userId) },
        include: {
            product: true,
            user: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
    });
}
