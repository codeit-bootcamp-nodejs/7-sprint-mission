import { create } from 'superstruct';
import { IdParamsStruct } from '../structs/commonStructs';
import {
    CreateArticleBodyStruct,
    GetArticleListParamsStruct,
    UpdateArticleBodyStruct,
} from '../structs/articlesStructs';
import { assertUserId } from '../classes/User';
import { Request, Response } from 'express';
import * as articleService from '../services/articleService';

export async function createArticle(req: Request, res: Response) {
    const { title, content, image } = create(req.body, CreateArticleBodyStruct);
    const userId = assertUserId(req);

    const article = await articleService.createArticle({
        title,
        content,
        image,
        userId,
    });
    return res.status(201).send(article);
}

export async function getArticle(req: Request, res: Response) {
    const { id } = create(req.params, IdParamsStruct);

    const article = await articleService.getArticle({ articleId: id });

    return res.send(article);
}

export async function updateArticle(req: Request, res: Response) {
    const { id } = create(req.params, IdParamsStruct);
    const { title, content, image } = create(req.body, UpdateArticleBodyStruct);
    const userId = assertUserId(req);

    const article = await articleService.updateArticle({
        articleId: id,
        userId,
        title,
        content,
        image,
    });

    return res.send(article);
}

export async function deleteArticle(req: Request, res: Response) {
    const { id } = create(req.params, IdParamsStruct);
    const userId = assertUserId(req);

    const result = articleService.deleteArticle({ articleId: id, userId });

    return res.status(204).send(result);
}

export async function getArticleList(req: Request, res: Response) {
    const { page, pageSize, orderBy, keyword } = create(req.query, GetArticleListParamsStruct);

    const { articles, totalCount } = await articleService.getArticleList({
        page,
        pageSize,
        orderBy,
        keyword,
    });

    return res.send({
        list: articles,
        totalCount,
    });
}

export async function toggleArticleLike(req: Request, res: Response) {
    const { id: articleId } = create(req.params, IdParamsStruct); // 상품 ID
    const userId = assertUserId(req);

    const result = await articleService.toggleArticleLike({ articleId, userId });

    return res.status(201).json({
        ...result,
    });
}
export async function getMyLikedArticles(req: Request, res: Response) {
    const userId = assertUserId(req);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { articles, totalCount } = await articleService.getMyLikedArticles({
        userId,
        limit,
        skip,
    });
    res.status(200).json({
        data: articles,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
    });
}
