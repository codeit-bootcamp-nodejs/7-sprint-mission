import type { Prisma } from '@prisma/client';

/**
 * Prisma cursor pagination 옵션 생성기
 *
 * @param {Object} options
 * @param {string|undefined} options.cursor - cursor 값 (id)
 * @param {number} options.limit - 가져올 개수
 * @param {Object} options.where - Prisma where 조건
 * @returns {Object} prisma findMany options
 */

interface CursorPaginationArgs {
  cursor?: bigint | undefined;
  limit?: number;
  where?: Prisma.CommentWhereInput;
}

export const cursorPaginationOption = ({ cursor, limit = 10, where }: CursorPaginationArgs) => {
  const take = Math.min(Math.max(limit, 1), 50);

  return {
    take,
    orderBy: { id: 'desc' as const },
    where: {
      ...where,
      ...(typeof cursor === 'string' && {
        id: { lt: cursor },
      }),
    },
  };
};
