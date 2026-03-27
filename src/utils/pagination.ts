export interface OffsetPaginationOptions {
  page: number;
  pageSize: number;
}

export interface OffsetPaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function getOffsetPaginationParams(options: OffsetPaginationOptions) {
  const { page, pageSize } = options;
  const skip = (page - 1) * pageSize;
  return { skip, take: pageSize };
}

export function buildOffsetResult<T>(
  data: T[],
  total: number,
  options: OffsetPaginationOptions
): OffsetPaginationResult<T> {
  return {
    data,
    total,
    page: options.page,
    pageSize: options.pageSize,
    totalPages: Math.ceil(total / options.pageSize),
  };
}

export interface CursorPaginationOptions {
  cursor?: number;
  limit: number;
}

export interface CursorPaginationResult<T> {
  data: T[];
  nextCursor: number | null;
}

export function buildCursorResult<T extends { id: number }>(
  data: T[],
  limit: number
): CursorPaginationResult<T> {
  const hasNext = data.length > limit;
  const items = hasNext ? data.slice(0, limit) : data;
  const nextCursor = hasNext ? items[items.length - 1].id : null;
  return { data: items, nextCursor };
}
