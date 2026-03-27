import { Request, Response, NextFunction } from 'express';
import { sendCreated } from '../utils/response';

export function uploadImage(req: Request, res: Response, next: NextFunction): void {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    sendCreated(res, { imageUrl });
  } catch (e) {
    next(e);
  }
}
