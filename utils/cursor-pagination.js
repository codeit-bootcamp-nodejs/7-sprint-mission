/**
 * Cursor Pagination 관련 유틸리티 함수들을 제공합니다.
 * 이 유틸리티는 Prisma의 `cursor` 및 `where` 절과 연동하여 동작합니다.
 */

import { BadRequestError } from "../errors/customErrors.js"; // 오류 처리 유틸리티를 사용한다고 가정

// ====================================================================
// 1. Continuation Token (커서 토큰) 관련 함수
// ====================================================================

/**
 * 객체 데이터를 Base64로 인코딩하여 안전한 문자열 커서(Continuation Token)를 생성합니다.
 * @param {object} data - 커서로 사용할 필드 값 (예: { id: 123, created_at: Date })
 * @param {string[]} sort - 정렬에 사용된 필드 이름 배열 (예: ["created_at", "id"])
 * @returns {string} Base64로 인코딩된 커서 문자열
 */
export function createContinuationToken(data, sort) {
  if (!data || sort.length === 0) {
    return null;
  }
  const tokenPayload = {
    data,
    sort,
  };
  const jsonString = JSON.stringify(tokenPayload);
  return Buffer.from(jsonString).toString('base64');
}

/**
 * Base64로 인코딩된 커서 문자열을 파싱하여 객체 데이터로 복원합니다.
 * 유효하지 않은 커서는 예외 처리합니다.
 * @param {string | undefined} token - 요청 쿼리에서 받은 커서 문자열
 * @returns {{data: object, sort: string[]} | null} 파싱된 데이터와 정렬 필드
 * @throws {BadRequestError} 커서가 유효하지 않을 경우
 */
export function parseContinuationToken(token) {
  if (!token) {
    return null;
  }
  try {
    const jsonString = Buffer.from(token, 'base64').toString('utf8');
    const parsed = JSON.parse(jsonString);

    if (!parsed || typeof parsed.data !== 'object' || !Array.isArray(parsed.sort)) {
      throw new Error("Invalid structure");
    }

    // Date 객체 복원 (필요하다면)
    if (parsed.data.created_at && typeof parsed.data.created_at === 'string') {
      parsed.data.created_at = new Date(parsed.data.created_at);
    }

    return parsed;
  } catch (e) {
    console.error("Cursor parsing error:", e);
    // Bad Request 에러로 변환하여 사용자에게 알림
    throw new BadRequestError("유효하지 않은 커서(cursor) 값입니다.");
  }
}

// ====================================================================
// 2. Prisma 쿼리 관련 함수
// ====================================================================

/**
 * Prisma `orderBy` 배열을 커서 로직에서 사용할 정렬 필드 이름 배열로 변환합니다.
 * @param {object[]} orderBy - Prisma `orderBy` 배열 (예: [{ created_at: "desc" }, { id: "asc" }])
 * @returns {string[]} 정렬 필드 이름 배열 (예: ["created_at", "id"])
 */
export function orderByToSort(orderBy) {
  return orderBy.map(item => Object.keys(item)[0]);
}

/**
 * 커서 데이터와 정렬 방향을 기반으로 Prisma의 `where` 절에 필요한 커서 조건을 생성합니다.
 * 이는 'Next' 페이지를 조회하기 위해 이전 페이지의 마지막 항목보다 이전/이후 항목을 필터링합니다.
 * * @param {object} cursorData - 파싱된 커서 데이터 (예: { id: 123, created_at: Date })
 * @param {string[]} sort - 정렬 필드 이름 배열 (예: ["created_at", "id"])
 * @returns {object} Prisma `where` 절 객체
 */
export function buildCursorWhere(cursorData, sort) {
  if (sort.length === 0) {
    return {};
  }

  // 1. 첫 번째 정렬 필드 (예: created_at)
  const primaryField = sort[0];
  const primaryDirection = Object.values(cursorData[primaryField])[0] === 'desc' ? 'lt' : 'gt'; // 'desc'면 <, 'asc'면 >

  let whereClause = {
    [primaryField]: {
      [primaryDirection]: cursorData[primaryField]
    }
  };

  // 2. 복합 정렬 처리 (Primary 필드 값이 같을 경우 Secondary 필드로 필터링)
  if (sort.length > 1) {
    const secondaryField = sort[1];
    const secondaryDirection = primaryDirection; // 두 번째 정렬 필드도 첫 번째와 같은 비교 방향을 사용

    whereClause = {
      OR: [
        // Case 1: Primary 필드 값이 커서 값보다 더 이전/이후인 경우 (주 정렬 조건)
        whereClause,
        // Case 2: Primary 필드 값이 커서 값과 같을 경우, Secondary 필드로 비교
        {
          [primaryField]: cursorData[primaryField], // primaryField 값은 커서와 같고
          [secondaryField]: {
            [secondaryDirection]: cursorData[secondaryField] // secondaryField 값은 커서보다 더 이전/이후인 경우
          }
        }
      ]
    };
  }

  return whereClause;
}