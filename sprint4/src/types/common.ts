export type OrderBy = 'recent' | 'oldest';

export interface PaginationParams {
  page: number;
  pageSize: number;
  orderBy?: OrderBy;
  keyword?: string;
}

export interface PaginatedResponse<T> {
  list: T[];
  totalCount: number;
}

export interface CursorPaginationParams {
  cursor?: number;
  limit: number;
}

export interface CursorPaginatedResponse<T> {
  list: T[];
  nextCursor: number | null;
}
