export type SortDirection = 'asc' | 'desc';
export type Sort = Array<[field: string, direction: SortDirection]>;

export type ContinuationToken<TData extends Record<string, unknown>> = {
  data: TData;
  sort: Sort;
};

// string 변환 (JSON)
function jsonBigIntReplacer(_key: string, value: unknown) {
  return typeof value === 'bigint' ? value.toString() : value;
}

// 특정 key만 bigint 필드 복원 (Prisma BigInt 컬럼 비교)
function reviveBigIntFields<T extends Record<string, unknown>>(
  obj: T,
  bigintKeys: string[]
): T {
  if (!obj || typeof obj !== 'object') return obj;

  for (const key of bigintKeys) {
    const v = obj[key];
    if (typeof v === 'string' && v.trim() !== '') {
      try {
        (obj as Record<string, unknown>)[key] = BigInt(v);
      } catch {
      }
    }
  }

  return obj;
}

/**
 * nextCursor 생성
 * - 마지막 아이템(lastItem) + 정렬 기준(sort)을 token에 담아 base64로 반환
 * - lastItem 없으면 null
 */
export function createContinuationToken<TData extends Record<string, unknown>>(
  lastItem: TData | null | undefined,
  sort: Sort
): string | null {
  if (!lastItem) return null;

  const token: ContinuationToken<TData> = { data: lastItem, sort };

  return Buffer.from(JSON.stringify(token, jsonBigIntReplacer)).toString('base64');
}

/**
 * nextCursor 파싱
 * - base64 → JSON → { data, sort } 복원
 * - bigintKeys에 지정한 필드만 BigInt로 되돌림
 * - 구조가 이상하면 null
 */
export function parseContinuationToken<TData extends Record<string, unknown>>(
  token: string | undefined,
  bigintKeys: string[] = []
): ContinuationToken<TData> | null {
  if (!token) return null;

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parsed = JSON.parse(decoded) as ContinuationToken<TData>;

    // 기본 구조 검증
    if (!parsed || typeof parsed !== 'object') return null;
    if (!parsed.data || !parsed.sort || !Array.isArray(parsed.sort)) return null;

    // bigint 필드 복원
    reviveBigIntFields(parsed.data, bigintKeys);

    // sort 값 검증
    for (const [field, dir] of parsed.sort) {
      if (typeof field !== 'string') return null;
      if (dir !== 'asc' && dir !== 'desc') return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

/**
 * Cursor 기반 Prisma where 조건 생성
 * - 다중 정렬 지원
 */
export function buildCursorWhere<TData extends Record<string, unknown>>(
  cursorData: TData | null | undefined,
  sort: Sort
): Record<string, unknown> {
  if (!cursorData || !sort || sort.length === 0) return {};

  const conditions: Array<Record<string, unknown>> = [];

  for (let i = 0; i < sort.length; i++) {
    const [field, direction] = sort[i];
    const operator = direction === 'desc' ? 'lt' : 'gt';

    // 이전 필드들은 모두 "같다" 조건
    const equalConditions: Record<string, unknown> = {};
    for (let j = 0; j < i; j++) {
      const [prevField] = sort[j];
      equalConditions[prevField] = cursorData[prevField];
    }

    // 현재 필드는 lt/gt 비교
    const condition: Record<string, unknown> = {
      ...equalConditions,
      [field]: { [operator]: cursorData[field] },
    };

    conditions.push(condition);
  }

  return conditions.length > 0 ? { OR: conditions } : {};
}

/**
 * Prisma orderBy -> sort 변환
 */
export function orderByToSort(
  orderBy: Array<Record<string, SortDirection>>
): Sort {
  return orderBy.map((item) => {
    const [field, direction] = Object.entries(item)[0] as [string, SortDirection];
    return [field, direction];
  });
}