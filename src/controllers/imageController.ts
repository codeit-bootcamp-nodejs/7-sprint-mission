import type { Request, Response } from 'express';
import * as imageService from '../services/imageService';
import { BadRequestError } from '../lib/errors/BadRequestError';

export async function uploadImage(req: Request, res: Response) {
    const isProd = process.env.NODE_ENV === 'PROD';
    const result = await imageService.uploadImage({
        file: req.file,
        host: req.get('host'),
    });

    return res.status(201).send(result);
}

export async function deleteImage(req: Request, res: Response) {
    const { filename } = req.params;
    if (!filename) throw new BadRequestError('삭제할 파일명이 필요합니다.');
    await imageService.deleteImage(filename);
    return res.status(200).json({
        message: '성공적으로 삭제되었습니다.',
    });
}
