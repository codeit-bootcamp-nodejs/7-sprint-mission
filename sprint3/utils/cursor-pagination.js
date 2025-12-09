// utils/cursor-pagination.js
export function getCursorPagination(query) {
  const take = Number(query.limit) || 10;
  const cursorId = query.cursor ? Number(query.cursor) : null;

  return { take, cursorId };
}
