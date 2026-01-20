import { prismaClient } from '../lib/prismaClient.js';

export const imageRepository = {
  // DB에 이미지 주소 저장하려고 할때 사용
  async saveImageInfo(data: { url: string; userId: number }) {
    // return await prismaClient.image.create({ data });
  },
};
