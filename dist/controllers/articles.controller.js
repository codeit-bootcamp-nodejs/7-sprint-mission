"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlikeArticle = exports.likeArticle = void 0;
exports.createArticle = createArticle;
exports.getArticle = getArticle;
exports.updateArticle = updateArticle;
exports.deleteArticle = deleteArticle;
exports.getArticleList = getArticleList;
exports.createArticleComment = createArticleComment;
exports.getCommentList = getCommentList;
const prismaClient_js_1 = require("../lib/prismaClient.js");
const errors_js_1 = require("../lib/errors.js");
const commons_js_1 = require("../validation/commons.js");
const articles_js_1 = require("../validation/articles.js");
const comments_js_1 = require("../validation/comments.js");
async function createArticle(req, res) {
    const userId = req.user.id;
    const data = articles_js_1.CreateArticle.parse(req.body);
    const article = await prismaClient_js_1.prisma.article.create({
        data: { ...data, userId },
    });
    return res.status(201).send(article);
}
async function getArticle(req, res) {
    const { id } = commons_js_1.IdParams.parse(req.params);
    const userId = req.user?.id ?? null;
    const article = await prismaClient_js_1.prisma.article.findUnique({
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
    if (!article) {
        throw new errors_js_1.NotFoundError("article", id);
    }
    const isLiked = userId ? article.likes.length > 0 : false;
    return res.send({
        ...article,
        isLiked,
        likes: undefined,
    });
}
async function updateArticle(req, res) {
    const { id } = commons_js_1.IdParams.parse(req.params);
    const data = articles_js_1.UpdateArticle.parse(req.body);
    const existingArticle = await prismaClient_js_1.prisma.article.findUnique({
        where: { id },
        select: { id: true },
    });
    if (!existingArticle)
        throw new errors_js_1.NotFoundError("article", id);
    if (existingArticle.userId !== userId) {
        throw new errors_js_1.ForbiddenError("작성자만 수정할 수 있습니다.");
    }
    const updatedAriticle = await prismaClient_js_1.prisma.article.update({ where: { id }, data });
    return res.send(updatedAriticle);
}
async function deleteArticle(req, res) {
    const { id } = create(req.params, commons_js_1.IdParams);
    const existingArticle = await prismaClient_js_1.prisma.article.findUnique({
        where: { id },
    });
    if (!existingArticle) {
        throw new errors_js_1.NotFoundError("article", id);
    }
    if (existingArticle.userId !== userId) {
        throw new errors_js_1.ForbiddenError("작성자만 삭제할 수 있습니다.");
    }
    await prismaClient_js_1.prisma.article.delete({ where: { id } });
    return res.status(204).send();
}
async function getArticleList(req, res) {
    const { page, pageSize, orderBy, keyword } = create(req.query, articles_js_1.GetArticleList);
    const where = {
        title: keyword ? { contains: keyword } : undefined,
    };
    const totalCount = await prismaClient_js_1.prisma.article.count({ where });
    const articles = await prismaClient_js_1.prisma.article.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: orderBy === "recent" ? { createdAt: "desc" } : { id: "asc" },
        where,
    });
    return res.send({
        list: articles,
        totalCount,
    });
}
// 댓글관련
async function createArticleComment(req, res) {
    const userId = req.user.id;
    const { id: articleId } = commons_js_1.IdParams.parse(req.params);
    const { content } = comments_js_1.CreateComment.parse(req.body);
    const article = await prismaClient_js_1.prisma.article.findUnique({
        where: { id: articleId },
        select: { id: true },
    });
    if (!article)
        throw new errors_js_1.NotFoundError("article", articleId);
    const comment = await prismaClient_js_1.prisma.comment.create({
        data: { content, userId, articleId },
    });
    return res.status(201).json(comment);
}
async function getCommentList(req, res) {
    const { id: articleId } = create(req.params, commons_js_1.IdParams);
    const { cursor, limit } = create(req.query, comments_js_1.GetCommentListParams);
    const existingProduct = await prismaClient_js_1.prisma.article.findUnique({
        where: { id: articleId },
    });
    if (!existingProduct) {
        throw new errors_js_1.NotFoundError("article", articleId);
    }
    const fetched = await prismaClient_js_1.prisma.comment.findMany({
        where: { articleId },
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
//좋아요
const ensureArticleExists = async (articleId) => {
    const a = await prismaClient_js_1.prisma.article.findUnique({
        where: { id: articleId },
        select: { id: true },
    });
    if (!a)
        throw new errors_js_1.NotFoundError("article", articleId);
};
const likeArticle = async (req, res) => {
    const userId = req.user.id;
    const articleId = Number(req.params.articleId);
    await ensureArticleExists(articleId);
    try {
        await prismaClient_js_1.prisma.articleLike.create({
            data: { userId, articleId },
        });
    }
    catch (e) {
        if (e?.code === "P2002") {
            throw new errors_js_1.ConflictError("이미 좋아요한 게시글입니다.");
        }
        throw e;
    }
    return res.status(201).json({ message: "liked" });
};
exports.likeArticle = likeArticle;
const unlikeArticle = async (req, res) => {
    const userId = req.user.id;
    const articleId = Number(req.params.articleId);
    await ensureArticleExists(articleId);
    try {
        await prismaClient_js_1.prisma.articleLike.delete({
            where: {
                userId_articleId: { userId, articleId },
            },
        });
    }
    catch (e) {
        if (e?.code === "P2025") {
            throw new BadRequestError("좋아요하지 않은 게시글입니다.");
        }
        throw e;
    }
    return res.status(200).json({ message: "unliked" });
};
exports.unlikeArticle = unlikeArticle;
//# sourceMappingURL=articles.controller.js.map