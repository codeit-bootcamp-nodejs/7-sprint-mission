/**
 * Prisma cursor pagination 옵션 생성기
 *
 * @param {Object} options
 * @param {string|undefined} options.cursor - cursor 값 (id)
 * @param {number} options.limit - 가져올 개수
 * @param {Object} options.where - Prisma where 조건
 * @returns {Object} prisma findMany options
 */
export const cursorPaginationOption = ({ cursor, limit = 10, where }) => {
  const take = Math.min(Math.max(limit, 1), 50);

  return {
    take,
    orderBy: { id: 'asc' },
    where: {
      ...where,
      ...(cursor && {
        id: { gt: BigInt(cursor) },
      }),
    },
  };
};
