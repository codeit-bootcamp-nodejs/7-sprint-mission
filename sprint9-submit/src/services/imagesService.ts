import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { AWS_S3_BUCKET_NAME, BASE_URL, NODE_ENV, PUBLIC_PATH } from '../lib/constants';
import s3 from '../lib/s3Client';

//환경에 따른 스토리지
const storage =
  NODE_ENV === 'production'
    ? multerS3({
        s3: s3,
        bucket: AWS_S3_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
          cb(null, `images/${uuidv4()}${path.extname(file.originalname)}`);
        },
      })
    : multer.diskStorage({
        destination: (req, file, cb) => cb(null, PUBLIC_PATH),
        filename: (req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`),
      });

export const upload = multer({ storage });

// URL만 추출함수
export const getUploadedImageUrl = (file: Express.Multer.File & Express.MulterS3.File) => {
  if (NODE_ENV === 'production') {
    return file.location; // S3 URL 반환
  }
  return `${BASE_URL}/public/${file.filename}`; // 로컬 URL 반환
};
