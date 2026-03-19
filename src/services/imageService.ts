import { BadRequestError } from '../lib/errors/BadRequestError';
import {
    AWS_ACCESS_KEY_ID,
    AWS_REGION,
    AWS_S3_BUCKET_NAME,
    AWS_SECRET_ACCESS_KEY,
    STATIC_PATH,
} from '../lib/constants';
import { UploadImageParams } from '../lib/types/imageType';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});

export async function uploadImage({ file, host }: UploadImageParams) {
    if (!file) throw new BadRequestError('이미지 파일이 없습니다.');
    if (!host) throw new BadRequestError('호스트 정보가 없습니다.');

    const fileKey = `${STATIC_PATH.replace(/^\//, '')}/${file.filename}`;
    try {
        const command = new PutObjectCommand({
            Bucket: AWS_S3_BUCKET_NAME,
            Key: fileKey,
            Body: file.buffer, // Multer 사용 시 buffer 필드 존재
            ContentType: file.mimetype, // 브라우저에서 올바르게 열리도록 설정
        });
        await s3Client.send(command);
    } catch (error) {
        throw new Error('S3 업로드 중 오류가 발생했습니다.');
    }

    return generateImageUrl({ host, filename: file.filename });
}

export async function deleteImage(filename: string) {
    try {
        const command = new DeleteObjectCommand({
            Bucket: AWS_S3_BUCKET_NAME,
            Key: `${STATIC_PATH.replace(/^\//, '')}/${filename}`,
        });
        await s3Client.send(command);
    } catch (error) {
        throw new Error('S3 파일 삭제 중 오류가 발생했습니다.');
    }
}

function generateImageUrl({ host, filename }: { host: string; filename: string }) {
    const isProd = process.env.NODE_ENV === 'PROD';
    const protocol = isProd ? 'https' : 'http';
    return `${protocol}://${host}${STATIC_PATH}/${filename}`;
}
