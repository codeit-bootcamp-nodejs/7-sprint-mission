import { Product } from '../classes/Product';
import * as productRepository from '../repositories/productRepository';
import { NotFoundError } from '../lib/errors/NotFoundError';
import { ForbiddenError } from '../lib/errors/ForbiddenError';

export async function createProduct({
    name,
    description,
    price,
    tags,
    images,
    userId,
}: {
    name: string;
    userId: string;
    description: string;
    price: number;
    tags: string[];
    images: string[];
}): Promise<Product> {
    const createProduct = await productRepository.createProduct({
        name,
        description,
        price,
        tags,
        images,
        userId,
    });

    return Product.fromEntity(createProduct);
}
export async function updateProduct({
    productId,
    userId,
    name,
    description,
    price,
    tags,
    images,
}: {
    productId: string;
    userId: string;
    name?: string;
    description?: string;
    price?: number;
    tags?: string[];
    images?: string[];
}) {
    const existingProduct = await productRepository.findProductById({ productId });
    if (!existingProduct) {
        throw new NotFoundError('Product', Number(productId));
    }
    if (existingProduct.userId.toString() !== userId) {
        throw new ForbiddenError('본인의 상품만 수정할 수 있습니다.');
    }

    const updatedProduct = await productRepository.updateProduct({
        productId,
        name,
        description,
        price,
        tags,
        images,
    });

    return Product.fromEntity(updatedProduct);
}
export async function deleteProduct({ productId, userId }: { productId: string; userId: string }) {
    const existingProduct = await productRepository.findProductById({ productId });

    if (!existingProduct) {
        throw new NotFoundError('Product', Number(productId));
    }
    if (existingProduct.userId.toString() !== userId) {
        throw new ForbiddenError('본인의 상품만 삭제할 수 있습니다.');
    }
    await productRepository.deleteProduct({ productId, userId });
}
export async function getProduct({ productId }: { productId: string }) {
    const findProduct = await productRepository.findProductById({ productId });
    if (!findProduct) {
        throw new NotFoundError('Product', Number(productId));
    }
    return Product.fromEntity(findProduct);
}
export async function getProductList({
    keyword,
    page,
    pageSize,
    orderBy,
}: {
    page: number;
    pageSize: number;
    keyword?: string;
    orderBy?: string;
}) {
    const where = keyword
        ? {
              OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
          }
        : undefined;
    const { totalCount, productList } = await productRepository.findProductsWithCount({
        page,
        pageSize,
        orderBy,
        where,
    });
    return {
        products: Product.fromEntityList(productList),
        totalCount,
    };
}
export async function toggleProductLike({
    productId,
    userId,
}: {
    productId: string;
    userId: string;
}) {
    const product = await productRepository.findProductById({ productId });
    if (!product) {
        throw new NotFoundError('Product', Number(productId));
    }

    return await productRepository.findWithToggleLike({ userId, productId });
}
export async function getMyLikedProducts({
    userId,
    limit,
    skip,
}: {
    userId: string;
    limit: number;
    skip: number;
}) {
    const { totalCount, likedProducts } = await productRepository.findLikeProductsWithCount({
        userId,
        skip,
        limit,
    });
    const productList = likedProducts.map((item) => item.product);
    return {
        products: Product.fromEntityList(productList),
        totalCount,
    };
}
