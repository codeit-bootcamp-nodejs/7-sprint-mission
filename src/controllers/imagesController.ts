import * as multerModule from 'multer';
import type { Request, Response } from 'express';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PUBLIC_PATH, STATIC_PATH } from '../lib/constants';
import BadRequestError from '../lib/errors/BadRequestError';

const multer = (multerModule as any).default || multerModule;

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

export const upload = (multer as any)({
  storage: (multer as any).diskStorage({
    destination(
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void,
    ) {
      cb(null, PUBLIC_PATH);
    },
    filename(
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void,
    ) {
      const ext = path.extname(file.originalname);
      const filename = `${uuidv4()}${ext}`;
      cb(null, filename);
    },
  }),

  limits: {
    fileSize: FILE_SIZE_LIMIT,
  },

  fileFilter: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      const err = new BadRequestError('Only png, jpeg, and jpg are allowed');
      return cb(err, false);
    }

    cb(null, true);
  },
});

export async function uploadImage(req: Request, res: Response) {
  // req.file 존재 여부 확인 (타입 가드)
  if (!req.file) {
    throw new BadRequestError('파일이 업로드되지 않았습니다.');
  }

  const host = req.get('host');

  // host가 undefined일 수 있으므로 ?? '' 처리
  const filePath = path.join(host ?? '', STATIC_PATH, req.file.filename);
  const url = `http://${filePath}`;

  return res.send({ url });
}
