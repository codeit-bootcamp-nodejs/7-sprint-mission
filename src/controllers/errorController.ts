import { StructError } from 'superstruct';
import { BadRequestError } from '../lib/errors/BadRequestError';
import { NotFoundError } from '../lib/errors/NotFoundError';
import { ConflictError } from '../lib/errors/ConflictError';
import { ForbiddenError } from '../lib/errors/ForbiddenError';
import { UnauthorizedError } from '../lib/errors/UnauthorizedError';
import { NextFunction, Request, Response } from 'express';

export function defaultNotFoundHandler(req: Request, res: Response, next: NextFunction) {
    return res.status(404).send({
        message: '요청하신 페이지를 찾을 수 없습니다.',
    });
}

export function globalErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    //  console.error(err.stack);
    if (err instanceof BadRequestError) {
        return res.status(400).send({
            message: err.message,
        });
    }

    if (err instanceof UnauthorizedError) {
        return res.status(401).send({
            message: err.message,
        });
    }

    if (err instanceof ForbiddenError) {
        return res.status(403).send({
            message: err.message,
        });
    }

    if (err instanceof NotFoundError) {
        return res.status(404).send({
            message: err.message,
        });
    }

    if (err instanceof ConflictError) {
        return res.status(409).send({
            message: err.message,
        });
    }

    if (err instanceof StructError) {
        return res.status(400).send({
            message: '입력값이 올바르지 않습니다.',
            details: err.failures(),
        });
    }

    if (err.status === 400 && 'body' in err) {
        return res.status(400).send({
            message: '잘못된 JSON 형식입니다.',
        });
    }
    if (err.name === 'AuthenticationError') {
        return res.status(401).send({
            message: '인증에 실패하였습니다.',
        });
    }

    if (err.code) {
        console.error(err);
        return res.status(500).send({ message: '데이터 처리 중 오류가 발생했습니다.' });
    }

    return res.status(500).send({ message: '서버 내부 오류가 발생했습니다.' });
}
