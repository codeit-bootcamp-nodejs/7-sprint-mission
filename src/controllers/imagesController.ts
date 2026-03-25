import { Request, Response } from 'express';
import * as imageService from '../services/imageService';

export async function uploadImage(req: Request, res: Response) {
  const url = await imageService.uploadImage(req.file);
  res.send({ url });
}
