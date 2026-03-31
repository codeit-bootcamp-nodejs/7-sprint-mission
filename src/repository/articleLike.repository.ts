import prisma from '../../prisma/prisma';

/**
 * 좋아요를 눌렀는지 확인하는 함수
 * @param articleId - 확인할 게시글 ID
 * @param userId - 확인할 유저 ID
 * @returns 좋아요 정보 또는 null
 */
export const findArticleLike = async (articleId: bigint, userId: bigint) => {
  const articleLike = await prisma.articleLike.findUnique({
    where: {
      userId_articleId: { userId, articleId },
    },
  });

  return articleLike;
};

/**
 * 게시글 좋아요를 추가하는 함수
 * @param articleId - 좋아요를 추가할 게시글 ID
 * @param userId - 좋아요를 누른 유저 ID
 */
export const articleLikeRepository = async (articleId: bigint, userId: bigint): Promise<void> => {
  await prisma.articleLike.create({
    data: { articleId, userId },
  });
};

/**
 * 게시글 좋아요를 취소하는 함수
 * @param articleId - 좋아요를 취소할 게시글 ID
 * @param userId - 좋아요를 취소할 유저 ID
 */
export const unLikeArticleRepository = async (articleId: bigint, userId: bigint): Promise<void> => {
  await prisma.articleLike.delete({
    where: {
      userId_articleId: { userId, articleId },
    },
  });
};
