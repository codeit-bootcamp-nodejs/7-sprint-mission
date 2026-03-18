"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlikeProduct = exports.likeProduct = void 0;
exports.createProduct = createProduct;
exports.getProduct = getProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.getProductList = getProductList;
exports.createProductComment = createProductComment;
exports.getCommentList = getCommentList;
const prismaClient_js_1 = require("../lib/prismaClient.js");
const errors_js_1 = require("../lib/errors.js");
const commons_js_1 = require("../validation/commons.js");
const products_js_1 = require("../validation/products.js");
const comments_js_1 = require("../validation/comments.js");
async function createProduct(req, res) {
    const userId = req.user.id;
    const { name, description, price, tags, images } = products_js_1.CreateProduct.parse(req.body);
    const product = await prismaClient_js_1.prisma.product.create({
        data: {
            name,
            description,
            price,
            tags,
            images,
            userId,
        },
    });
    res.status(201).send(product);
}
async function getProduct(req, res) {
    const { id } = commons_js_1.IdParams.parse(req.params);
    const userId = req.user?.id ?? null;
    const product = await prismaClient_js_1.prisma.product.findUnique({
        where: { id },
        include: {
            likes: userId
                ? {
                    where: { userId },
                    select: { id: true },
                    take: 1,
                }
                : false,
        },
    });
    if (!product) {
        throw new errors_js_1.NotFoundError("product", id);
    }
    const isLiked = userId ? product.likes.length > 0 : false;
    return res.send({
        ...product,
        isLiked,
        likes: undefined,
    });
}
async function updateProduct(req, res) {
    const { id } = commons_js_1.IdParams.parse(req.params);
    const data = products_js_1.UpdateProduct.parse(req.body);
    const existingProduct = await prismaClient_js_1.prisma.product.findUnique({
        where: { id },
    });
    if (!existingProduct) {
        throw new errors_js_1.NotFoundError("product", id);
    }
    if (existingProduct.userId !== userId) {
        return res.status(403).json({ message: "작성자만 수정할 수 있습니다." });
    }
    const updatedProduct = await prismaClient_js_1.prisma.product.update({
        where: { id },
        data,
    });
    return res.send(updatedProduct);
}
async function deleteProduct(req, res) {
    const { id } = commons_js_1.IdParams.parse(req.params);
    const existingProduct = await prismaClient_js_1.prisma.product.findUnique({
        where: { id },
    });
    if (!existingProduct) {
        throw new errors_js_1.NotFoundError("product", id);
    }
    if (existingProduct.userId !== userId) {
        return res.status(403).json({ message: "작성자만 삭제할 수 있습니다." });
    }
    await prismaClient_js_1.prisma.product.delete({ where: { id } });
    return res.status(204).send();
}
async function getProductList(req, res) {
    const { page, pageSize, orderBy, keyword } = products_js_1.GetProductList.parse(req.query);
    const where = keyword
        ? {
            OR: [
                { name: { contains: keyword } },
                { description: { contains: keyword } },
            ],
        }
        : undefined;
    const totalCount = await prismaClient_js_1.prisma.product.count({ where });
    const products = await prismaClient_js_1.prisma.product.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: orderBy === "recent" ? { id: "desc" } : { id: "asc" },
        where,
    });
    return res.send({
        list: products,
        totalCount,
    });
}
//product comment 관련
async function createProductComment(req, res) {
    const userId = req.user.id;
    const { id: productId } = commons_js_1.IdParams.parse(req.params);
    const { content } = comments_js_1.CreateComment.parse(req.body);
    const product = await prismaClient_js_1.prisma.product.findUnique({
        where: { id: productId },
        select: { id: true },
    });
    if (!product)
        throw new errors_js_1.NotFoundError("product", productId);
    const comment = await prismaClient_js_1.prisma.comment.create({
        data: { content, userId, productId },
    });
    return res.status(201).json(comment);
}
async function getCommentList(req, res) {
    const { id: productId } = create(req.params, commons_js_1.IdParams);
    const { cursor, limit } = create(req.query, comments_js_1.GetCommentListParams);
    const existingProduct = await prismaClient_js_1.prisma.product.findUnique({
        where: { id: productId },
    });
    if (!existingProduct) {
        throw new errors_js_1.NotFoundError("product", productId);
    }
    const fetched = await prismaClient_js_1.prisma.comment.findMany({
        where: { productId },
        orderBy: { id: "desc" },
        cursor: cursor ? { id: cursor } : undefined,
        skip: cursor ? 1 : undefined,
        take: limit + 1,
    });
    const hasNext = fetched.length > limit;
    const list = fetched.slice(0, limit);
    const nextCursor = hasNext ? list[list.length - 1].id : null;
    return res.send({ list, nextCursor });
}
const ensureProductExists = async (productId) => {
    const p = await prismaClient_js_1.prisma.product.findUnique({
        where: { id: productId },
        select: { id: true },
    });
    if (!p)
        throw new errors_js_1.NotFoundError("product", productId);
};
const likeProduct = async (req, res) => {
    const userId = req.user.id;
    const productId = Number(req.params.productId);
    await ensureProductExists(productId);
    try {
        await prismaClient_js_1.prisma.productLike.create({
            data: { userId, productId },
        });
    }
    catch (e) {
        if (e?.code === "P2002") {
            throw new errors_js_1.ConflictError("이미 좋아요한 상품입니다.");
        }
        throw e;
    }
    return res.status(201).json({ message: "liked" });
};
exports.likeProduct = likeProduct;
const unlikeProduct = async (req, res) => {
    const userId = req.user.id;
    const productId = Number(req.params.productId);
    await ensureProductExists(productId);
    try {
        await prismaClient_js_1.prisma.productLike.delete({
            where: {
                userId_productId: { userId, productId },
            },
        });
    }
    catch (e) {
        if (e?.code === "P2025") {
            throw new errors_js_1.BadRequestError("좋아요하지 않은 상품입니다.");
        }
        throw e;
    }
    return res.status(200).json({ message: "unliked" });
};
exports.unlikeProduct = unlikeProduct;
//# sourceMappingURL=products.controller.js.map