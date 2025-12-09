import prisma from '../prisma/client.js';

export const createComment = async (data) => await prisma.comment.create({ data });

export const updateComment = async (id, content) => await prisma.comment.update({ where: { id: parseInt(id) }, data: { content } });

export const deleteComment = async (id) => await prisma.comment.delete({ where: { id: parseInt(id) } });

// [추가] Cursor 기반 댓글 목록 조회
export const getComments = async ({ productId, articleId, cursor, limit = 10 }) => {
  const where = {};
  if (productId) where.productId = productId;
  if (articleId) where.articleId = articleId;

  const queryOptions = {
    where,
    take: limit,
    orderBy: { createdAt: 'desc' }, // 최신순
  };

  // 커서가 존재하면 해당 ID 다음부터 조회
  if (cursor) {
    queryOptions.cursor = { id: parseInt(cursor) };
    queryOptions.skip = 1;
  }

  const list = await prisma.comment.findMany(queryOptions);
  
  // 다음 커서 계산 (마지막 아이템의 ID)
  const nextCursor = list.length === limit ? list[list.length - 1].id : null;

  return { list, nextCursor };
};
