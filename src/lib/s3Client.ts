import { S3Client } from '@aws-sdk/client-s3';
import {
  AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  NODE_ENV,
} from './constants';

const s3Client =
  NODE_ENV === 'production'
    ? new S3Client({
        region: AWS_REGION,
        credentials: {
          accessKeyId: AWS_ACCESS_KEY,
          secretAccessKey: AWS_SECRET_ACCESS_KEY,
        },
      })
    : null;

export default s3Client;
