import { UserParam } from './authType';

export type ProductParam = {
    id: string;
    userId: string;
    name: string;
    description: string;
    price: number;
    tags?: string[];
    images?: string[];
    createdAt: Date;
    updatedAt: Date;
};

export type ProductLikeParam = {
    id: string;
    userId: string;
    productId: string;
    createdAt: Date;
    updatedAt: Date;
    user: UserParam;
    product: ProductParam;
};

export type ProductData = {
    id: bigint;
    userId: bigint;
    name: string;
    description: string;
    price: number;
    tags?: string[];
    images?: string[];
    createdAt: Date;
    updatedAt: Date;
};

export type ProductLikeData = {
    id: bigint;
    userId: bigint;
    productId: bigint;
    createdAt: Date;
    updatedAt: Date;
    user: UserParam;
    product: ProductParam;
};

export type CreateProductInput = Pick<
    ProductParam,
    'userId' | 'name' | 'description' | 'price' | 'tags' | 'images'
>;
export type UpdateArticleInput = Partial<
    Pick<ProductParam, 'name' | 'description' | 'price' | 'tags' | 'images'>
>;
