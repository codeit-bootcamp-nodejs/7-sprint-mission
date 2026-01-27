import { ProductData, ProductParam } from '../lib/types/productType';

export class Product {
    readonly id: string;
    readonly userId: string;
    readonly name: string;
    readonly description: string;
    readonly price: number;
    readonly tags: string[];
    readonly images: string[];
    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor({
        id,
        userId,
        name,
        description,
        price,
        createdAt,
        updatedAt,
        tags = [],
        images = [],
    }: ProductParam) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.description = description;
        this.price = price;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.tags = tags;
        this.images = images;
    }
    static fromEntity(product: ProductData): Product {
        if (!product) throw new Error('데이터가 존재하지 않습니다.');
        return new Product({
            id: product.id.toString(),
            userId: product.userId.toString(),
            name: product.name,
            description: product.description,
            price: product.price,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            tags: product.tags,
            images: product.images,
        });
    }
    static fromEntityList(products: ProductData[] = []): Product[] {
        return products.map(Product.fromEntity);
    }
}
