import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ValidationError } from '../errors/validationError.js';

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export const createUploader = (folderName) => {
  const uploadPath = path.join('uploads', folderName);
  ensureDir(uploadPath);

  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, uploadPath);
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, filename);
    },
  });

  const fileFilter = (req, file, cb) => {
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
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });
};

export const myProfileUpload = createUploader('user');
