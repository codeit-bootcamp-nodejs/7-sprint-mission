import { BadRequestError } from "../utils/CustomErrors.js";

export function validateProductInfo(req, res, next) {
  const body = req.body || {}; // req.body 존재 확인
  const { name, description, price, tags } = body;
  const isPatch = req.method === "PATCH";

  //patch 요청
  if (
    isPatch &&
    name === undefined &&
    price === undefined &&
    tags === undefined
  ) {
    return next(
      new BadRequestError(
        "수정을 위해서는 상품명, 가격, 또는 태그 중 최소한 하나는 필요합니다.",
        400
      )
    );
  }
  //post 요청
  if (req.method === "POST" && (!name || price === undefined)) {
    return next(new BadRequestError("상품명과 가격은 필수입니다."));
  }
  //name 검증
  if (name !== undefined && typeof name !== "string") {
    return next(new Error("상품명은 문자열이어야 합니다."));
  }

  //description 검증 (문자열 타입)
  if (description !== undefined && typeof description !== "string") {
    return next(new BadRequestError("설명은 문자열이어야 합니다."));
  }

  //tags 검증 (배열 타입)
  if (tags !== undefined) {
    if (!Array.isArray(tags)) {
      return next(
        new BadRequestError('태그는 배열(["tag1", "tag2"]) 형식이어야 합니다.')
      );
    }
    // 배열 요소가 모두 문자열인지 추가 검증 가능
  }

  //가격이 전달된경우, 숫자타입 검증 실행
  if (price !== undefined) {
    const numberPrice = parseInt(price, 10);
    //가격으로 문자열이나 유효하지 않는 숫자
    if (isNaN(numberPrice) || numberPrice <= 0) {
      return next(
        new BadRequestError("가격은 0보다 큰 유효한 숫자여야 합니다.")
      );
    }
    req.body.price = numberPrice;
  }
  next();
}

export function validateArticleInfo(req, res, next) {
  const { title, content } = req.body;
  const isPatch = req.method === "PATCH";

  //patch 요청
  if (isPatch && title === undefined && content === undefined) {
    return next(
      new BadRequestError(
        "수정을 위해서는 제목이나 내용이 최소한 하나는 필요합니다"
      )
    );
  }
  //post 요청
  if (req.method === "POST" && (!title || !content)) {
    return next(new BadRequestError("제목과 내용은 필수입니다."));
  }

  //title 검증 (문자열 타입 및 비어있지 않음)
  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length === 0) {
      return next(new BadRequestError("제목은 유효한 문자열이어야 합니다."));
    }
    req.body.title = title.trim();
  }

  // content 검증 (문자열 타입 및 비어있지 않음)
  if (content !== undefined) {
    if (typeof content !== "string" || content.trim().length === 0) {
      return next(new BadRequestError("내용은 유효한 문자열이어야 합니다."));
    }
    req.body.content = content.trim();
  }
  next();
}
