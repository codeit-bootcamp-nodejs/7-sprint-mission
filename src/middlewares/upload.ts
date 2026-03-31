import multer from 'multer';
import type { FileFilterCallback } from 'multer';
import path from 'path';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import { ValidationError } from '../errors/validationError';
import type { Request } from 'express';

const MB = 1024 * 1024;
const MAX_FILE_SIZE = 5 * MB; //5MB

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const createUploader = (folderName: string) => {
  const storage = multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME!,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key(_req, file, cb) {
      const ext = path.extname(file.originalname);
      const filename = `${folderName}/${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, filename);
    },
  });

  const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new ValidationError('이미지 파일만 업로드 가능합니다.'));
    } else {
      cb(null, true);
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: MAX_FILE_SIZE,
    },
  });
};

export const myProfileUpload = createUploader('user');
