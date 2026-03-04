import prisma from '../../prisma/prisma';

// 게시글 좋아요 했는지 안했는지 확인 로직
export const findArticleLike = async (articleId: bigint, userId: bigint) => {
  const articleLike = await prisma.articleLike.findUnique({
    where: {
      userId_articleId: { userId, articleId },
    },
  });

  return articleLike;
};

export const articleLikeRepository = async (articleId: bigint, userId: bigint): Promise<void> => {
  await prisma.articleLike.create({
    data: { articleId, userId },
  });
};

export const unLikeArticleRepository = async (articleId: bigint, userId: bigint): Promise<void> => {
  await prisma.articleLike.delete({
    where: {
      userId_articleId: { userId, articleId },
    },
  });
};
