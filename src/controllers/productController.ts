import { create } from 'superstruct';
import { IdParamsStruct } from '../structs/commonStructs';
import {
    CreateProductBodyStruct,
    GetProductListParamsStruct,
    UpdateProductBodyStruct,
} from '../structs/productsStruct';
import { assertUserId } from '../classes/User';
import { Request, Response } from 'express';
import * as productService from '../services/productService';

export async function createProduct(req: Request, res: Response) {
    const { name, description, price, tags, images } = create(req.body, CreateProductBodyStruct);
    const userId = assertUserId(req);
    const createProduct = await productService.createProduct({
        name,
        description,
        price,
        tags,
        images,
        userId,
    });

    res.status(201).send(createProduct);
}

export async function getProduct(req: Request, res: Response) {
    const { id } = create(req.params, IdParamsStruct);
    const product = await productService.getProduct({ productId: id });
    return res.send(product);
}

export async function updateProduct(req: Request, res: Response) {
    const { id } = create(req.params, IdParamsStruct);
    const { name, description, price, tags, images } = create(req.body, UpdateProductBodyStruct);
    const userId = assertUserId(req);
    const product = await productService.updateProduct({
        productId: id,
        name,
        description,
        price,
        tags,
        images,
        userId,
    });

    return res.send(product);
}

export async function deleteProduct(req: Request, res: Response) {
    const { id } = create(req.params, IdParamsStruct);
    const userId = assertUserId(req);
    await productService.deleteProduct({ productId: id, userId });

    return res.status(204).send();
}

export async function getProductList(req: Request, res: Response) {
    const { page, pageSize, orderBy, keyword } = create(req.query, GetProductListParamsStruct);

    const { products, totalCount } = await productService.getProductList({
        page,
        pageSize,
        orderBy,
        keyword,
    });

    return res.send({
        list: products,
        totalCount,
    });
}

export async function toggleProductLike(req: Request, res: Response) {
    const { id } = create(req.params, IdParamsStruct); // 상품 ID
    const userId = assertUserId(req);

    const result = await productService.toggleProductLike({ productId: id, userId });

    return res.status(201).json(result);
}
export async function getMyLikedProducts(req: Request, res: Response) {
    const userId = assertUserId(req);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { products, totalCount } = await productService.getMyLikedProducts({
        userId,
        limit,
        skip,
    });

    res.status(200).json({
        data: products,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
    });
}
