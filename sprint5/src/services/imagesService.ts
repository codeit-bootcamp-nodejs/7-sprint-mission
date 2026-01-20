import path from 'path';
import { STATIC_PATH } from '../lib/constants.js';
import BadRequestError from '../lib/errors/BadRequestError.js';

export const imageService = {
  generateImageUrl(host: string | undefined, filename: string | undefined): string {
    if (!host || !filename) {
      throw new BadRequestError('File upload failed or host is missing');
    }

    const filePath = path.join(host, STATIC_PATH, filename);
    return `http://${filePath}`;
  },
};
