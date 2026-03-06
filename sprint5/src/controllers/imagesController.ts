import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PUBLIC_PATH } from '../lib/constants.js';
import BadRequestError from '../lib/errors/BadRequestError.js';
import { imageService } from '../services/imagesService.js';
import type { Request, Response } from 'express';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

export const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, PUBLIC_PATH);
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, `${uuidv4()}${ext}`);
    },
  }),
  limits: { fileSize: FILE_SIZE_LIMIT },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new BadRequestError('Only png, jpeg, and jpg are allowed'));
    }
    cb(null, true);
  },
});

export async function uploadImage(req: Request & { file?: Express.Multer.File }, res: Response) {
  const host = req.get('host');
  const filename = req.file?.filename;
  const url = imageService.generateImageUrl(host, filename);

  return res.send({ url });
}
