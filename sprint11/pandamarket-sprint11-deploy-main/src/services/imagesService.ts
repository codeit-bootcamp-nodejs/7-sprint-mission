import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import BadRequestError from '../lib/errors/BadRequestError';
import { NODE_ENV, PUBLIC_PATH,BASE_URL, STATIC_PATH, AWS_S3_BUCKET_NAME} from '../lib/constants';
import s3Client from '../lib/s3Client';
import { PutObjectCommand } from '@aws-sdk/client-s3';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB

const generateFileName = (file: Express.Multer.File) => {
  const ext = path.extname(file.originalname);
  const filename = `${uuidv4()}${ext}`;
  return filename;
}

export const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, PUBLIC_PATH);
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      const filename = `${uuidv4()}${ext}`;
      cb(null, filename);
    },
  }),

  limits: {
    fileSize: FILE_SIZE_LIMIT,
  },

  fileFilter: function (req, file, cb) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      const err = new BadRequestError('Only png, jpeg, and jpg are allowed');
      return cb(err);
    }
    cb(null, true);
  },
});

export function uploadImage(file?: Express.Multer.File) {
  if (!file) {
    throw new BadRequestError('File is required');
  }
  
  if(NODE_ENV === 'production') {
   return uploadImageToS3(file);
  }
  return uploadImageToLocal(file);
}

export async function uploadImageToLocal(file: Express.Multer.File) {
  if (!file) {
    throw new BadRequestError('File is required');
  }
  const url = `${BASE_URL}/${STATIC_PATH}/${file.filename}`;
  return url;
}

export async function uploadImageToS3(file: Express.Multer.File) {
    
    if(!s3Client){
        throw new Error('S3 client is not initialized');
    }

    const key = generateFileName(file);

    const commend = new PutObjectCommand({
        Bucket: AWS_S3_BUCKET_NAME,
        Key: key,
        Body: file?.buffer,
        ContentType: file?.mimetype,
    });

    try {
        await s3Client.send(commend);
    } catch (error) {
        console.error(error);
        throw new Error(`Failed to upload image to S3: ${error}`);
    }
    
    const url = `http://${AWS_S3_BUCKET_NAME}.amazonaws.com/${key}`;
    return url;
}   

