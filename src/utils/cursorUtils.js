import { BadRequestError } from "../exceptions/errors.js";

// 1. 커서 토큰 파싱 함수
export function parseContinuationToken(cursor) {
  if (!cursor) return null;

  try {
    // Base64 디코딩 및 JSON 파싱
    const jsonString = Buffer.from(cursor, "base64").toString("utf8");
    const parsed = JSON.parse(jsonString); // 필수 필드 유효성 검사: data와 sort가 있는지 확인

    if (!parsed.data || !parsed.sort) {
      throw new Error("Invalid token format");
    }
    return parsed;
  } catch (e) {
    throw new BadRequestError("유효하지 않은 커서 토큰 형식입니다.");
  }
}

// 2. 커서 토큰 생성 함수
export function createContinuationToken(data, sort) {
  const payload = JSON.stringify({ data, sort });
  return Buffer.from(payload).toString("base64");
}

// 3. 정렬 배열을 단순화된 형식으로 변환
export function orderByToSort(orderBy) {
  return orderBy.map((item) => {
    const key = Object.keys(item)[0];
    return `${key}_${item[key]}`;
  });
}

// 4. 커서 기반 WHERE 조건 생성 (핵심 로직 개선)
export function buildCursorWhere(lastItemData, sortKeys) {
  // sortKeys: ["created_at_desc", "id_asc"] 기준
  if (sortKeys.length < 2) {
    throw new Error(
      "커서 페이징은 최소 2개의 정렬 키(주요 키, 보조 키)가 필요합니다."
    );
  }

  const [mainSortKey, secondarySortKey] = sortKeys;

  const mainKey = mainSortKey.split("_")[0];
  const secondaryKey = secondarySortKey.split("_")[0];

  // 1. 주요 키 값 (created_at) 변환
  let lastMainValue = lastItemData[mainKey];
  if (mainKey.includes("created_at") && typeof lastMainValue === "string") {
    lastMainValue = new Date(lastMainValue); // 문자열을 Date 객체로 변환
  }

  // 2. 보조 키 값 (id) 변환
  let lastSecondaryValue = lastItemData[secondaryKey];
  if (secondaryKey === "id" && typeof lastSecondaryValue !== "bigint") {
    // BigInt(문자열) 또는 BigInt(숫자)로 변환
    lastSecondaryValue = BigInt(lastSecondaryValue);
  }
  const mainOrder = mainSortKey.split("_")[1]; // desc
  const secondaryOrder = secondarySortKey.split("_")[1]; // asc
  // 1. 주요 키(created_at)가 이전 값보다 더 '정렬 순서에 맞게' 정렬되는 조건
  const mainOp = mainOrder === "desc" ? "lt" : "gt";
  const mainCondition = {
    [mainKey]: { [mainOp]: lastMainValue },
  };

  // 2. 보조 키(id) 조건: 주요 키 값이 같을 경우 보조 키가 다음 레코드를 가리켜야 함
  const secondaryOp = secondaryOrder === "asc" ? "gt" : "lt";

  const secondaryCondition = {
    // 주요 키는 이전 값과 같아야 함
    [mainKey]: lastMainValue, // 보조 키는 순서에 맞게 커야 함 (id는 보통 asc이므로 gt)
    [secondaryKey]: { [secondaryOp]: lastSecondaryValue },
  }; // 두 조건을 OR로 묶어서 반환합니다.
  // { (created_at < 이전값) OR (created_at = 이전값 AND id > 이전값) }
  return [{ OR: [mainCondition, secondaryCondition] }];
}
