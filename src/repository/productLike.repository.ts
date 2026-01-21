import prisma from '../prisma/prisma';

//상품 좋아요 확인
export const isProductLikedByUser = async (userId: bigint, productId: bigint) => {
  const productLike = await prisma.productLike.findUnique({
    where: {
      userId_productId: { userId, productId },
    },
  });

  return productLike;
};

//상품 좋아요 기능
export const productLikeRepo = async (userId: bigint, productId: bigint): Promise<void> => {
  await prisma.productLike.create({
    data: { userId, productId },
  });
};

//좋아요 취소 기능
export const deleteProductLikeRepo = async (userId: bigint, productId: bigint) => {
  await prisma.productLike.delete({
    where: {
      userId_productId: { userId, productId },
    },
  });
};
