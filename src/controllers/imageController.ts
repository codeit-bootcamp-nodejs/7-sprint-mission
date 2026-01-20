import type { Request, Response } from 'express';
import * as imageService from '../services/imageService';

export async function uploadImage(req: Request, res: Response) {
    const isProd = process.env.NODE_ENV === 'PROD';
    const result = await imageService.uploadImage({
        file: req.file,
        host: req.get('host'),
    });

    return res.status(201).send(result);
}
