import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { Request } from 'express';
import { PUBLIC_PATH } from './constants';
import { BadRequestError } from './errors/BadRequestError';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

export const upload = multer({
    storage: multer.diskStorage({
        destination: (req: Request, file: Express.Multer.File, cb) => {
            cb(null, PUBLIC_PATH);
        },
        filename: (req: Request, file: Express.Multer.File, cb) => {
            const ext = path.extname(file.originalname);
            const filename = `${uuidv4()}${ext}`;
            cb(null, filename);
        },
    }),

    limits: {
        fileSize: FILE_SIZE_LIMIT,
    },

    fileFilter: function (req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            return cb(new BadRequestError('png, jpeg, jpg 형식의 이미지만 업로드할 수 있습니다.'));
        }

        cb(null, true);
    },
});
