import { Request, Response } from 'express';
import * as imagesService from '../services/imagesService';
import BadRequestError from '../lib/errors/BadRequestError';

export async function uploadImage(req: Request, res: Response) {
  if (!req.file) {
    throw new BadRequestError('파일이 필요합니다.');
  }

  // 서비스에서 환경에 맞는 URL만 받아옴
  const url = imagesService.getUploadedImageUrl(req.file as any);

  res.send({ url });
}
