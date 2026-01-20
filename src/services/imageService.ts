import { BadRequestError } from '../lib/errors/BadRequestError';
import { STATIC_PATH } from '../lib/constants';
import { UploadImageParams } from '../lib/types/imageType';

export async function uploadImage({ file, host }: UploadImageParams) {
    if (!file) {
        throw new BadRequestError('이미지 파일이 없습니다.');
    }
    if (!host) {
        throw new BadRequestError('호스트 정보가 없습니다.');
    }

    return generateImageUrl({ host, filename: file.filename });
}

function generateImageUrl({ host, filename }: { host: string; filename: string }) {
    const isProd = process.env.NODE_ENV === 'PROD';
    const protocol = isProd ? 'https' : 'http';
    return `${protocol}://${host}${STATIC_PATH}/${filename}`;
}
