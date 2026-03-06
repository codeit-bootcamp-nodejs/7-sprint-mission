import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { PUBLIC_PATH, STATIC_PATH } from '../lib/constants';

const storage = multer.diskStorage({
  destination: PUBLIC_PATH,
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('이미지 파일만 업로드 가능합니다'));
    }
  },
});

export async function uploadImage(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      res.status(400).json({ message: '업로드된 파일이 없습니다' });
      return;
    }
    const url = `${STATIC_PATH}/${req.file.filename}`;
    res.status(201).json({ url });
  } catch (err) {
    next(err);
  }
}
