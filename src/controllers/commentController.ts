import { create } from 'superstruct';
import {
    CreateCommentBodyStruct,
    GetCommentListParamsStruct,
    UpdateCommentBodyStruct,
} from '../structs/commentsStruct';
import { CommentParamsStruct, IdParamsStruct } from '../structs/commonStructs';
import { assertUserId } from '../classes/User';
import { Request, Response } from 'express';
import * as commentService from '../services/commentService';
import { BadRequestError } from '../lib/errors/BadRequestError';

export async function createComment(req: Request, res: Response) {
    const { id } = create(req.params, IdParamsStruct);
    const { content } = create(req.body, CreateCommentBodyStruct);
    const userId = assertUserId(req);
    const target = validateTargetByUrl(req.originalUrl);

    const comment = await commentService.createComment(id, userId, content, target);

    return res.status(201).send(comment);
}

export async function updateComment(req: Request, res: Response) {
    const { id, targetId } = create(req.params, CommentParamsStruct);
    const { content } = create(req.body, UpdateCommentBodyStruct);
    const userId = assertUserId(req);
    const target = validateTargetByUrl(req.originalUrl);
    if (content === undefined || content === null || content === '') {
        throw new BadRequestError();
    }
    const comment = await commentService.updateComment(id, targetId, userId, content, target);

    return res.send(comment);
}

export async function deleteComment(req: Request, res: Response) {
    const { id, targetId } = create(req.params, CommentParamsStruct);
    const userId = assertUserId(req);
    const target = validateTargetByUrl(req.originalUrl);
    const result = await commentService.deleteComment(id, targetId, userId, target);

    return res.status(204).send(result);
}

export async function getCommentList(req: Request, res: Response) {
    const { id } = create(req.params, IdParamsStruct);
    const { cursor, limit } = create(req.query, GetCommentListParamsStruct);
    const target = validateTargetByUrl(req.originalUrl);

    const { comments, nextCursor } = await commentService.getCommentList({
        id,
        cursor,
        limit,
        target,
    });

    return res.send({
        list: comments,
        nextCursor,
    });
}

function validateTargetByUrl(urlPath: string) {
    const isProduct = urlPath.includes('products');
    const isArticle = urlPath.includes('articles');
    if (isProduct) return 'Product';
    if (isArticle) return 'Article';
    throw new Error('유효하지 않은 접근 경로입니다.');
}
