class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.status = 400;
  }
}

// 헬퍼 함수: 필수 필드 누락 검증
const checkRequiredFields = (body, requiredFields) => {
  for (const field of requiredFields) {
    if (!(field in body) || body[field] === undefined || body[field] === null) {
      throw new ValidationError(`필수 필드 '${field}'가 누락되었습니다.`);
    }
  }
};

// 헬퍼 함수: 데이터 타입 검증
const checkDataType = (body, field, expectedType) => {
  if (field in body && typeof body[field] !== expectedType) {
    if (expectedType === "array" && !Array.isArray(body[field])) {
      throw new ValidationError(
        `필드 '${field}'는(은) 배열 타입이어야 합니다. (현재 타입: ${typeof body[field]})`
      );
    } else if (
      expectedType !== "array" &&
      typeof body[field] !== expectedType
    ) {
      throw new ValidationError(
        `필드 '${field}'는(은) ${expectedType} 타입이어야 합니다. (현재 타입: ${typeof body[field]})`
      );
    }
  }
};

/**
 * Product 생성/업데이트 요청 본문을 검증하는 미들웨어
 * @param {object} req - Express 요청 객체
 * @param {object} res - Express 응답 객체
 * @param {function} next - 다음 미들웨어 함수
 */
export const validateProductInfo = (req, res, next) => {
  try {
    const { name, price, description, tags } = req.body;
    // 1. 필수 필드 누락 검증
    checkRequiredFields(req.body, ["name", "price"]);

    // 2. 데이터 타입 검증
    checkDataType(req.body, "name", "string");
    checkDataType(req.body, "price", "number");
    if (description !== undefined) {
      checkDataType(req.body, "description", "string");
    }
    if (tags !== undefined) {
      checkDataType(req.body, "tags", "object");
      if (Array.isArray(tags)) {
        tags.forEach((tag, index) => {
          if (typeof tag !== "string") {
            throw new ValidationError(
              `필드 'tags'의 ${index}번째 요소는 문자열이어야 합니다.`
            );
          }
        });
      } else {
        throw new ValidationError(`필드 'tags'는 배열 타입이어야 합니다.`);
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Article 생성/업데이트 요청 본문을 검증하는 미들웨어
 * @param {object} req - Express 요청 객체
 * @param {object} res - Express 응답 객체
 * @param {function} next - 다음 미들웨어 함수
 */
export const validateArticleInfo = (req, res, next) => {
  try {
    // 1. 필수 필드 누락 검증
    checkRequiredFields(req.body, ["title", "content"]);

    // 2. 데이터 타입 검증
    checkDataType(req.body, "title", "string");
    checkDataType(req.body, "content", "string");

    next();
  } catch (error) {
    // 3. 검증 실패 시 ValidationError 객체를 next()로 전달
    next(error);
  }
};

// 상세조회 형식 검증
export const validateBigIntId = (req, res, next) => {
  const { id } = req.params;

  // 10진수 숫자 문자열인지 확인
  const isNumeric = /^\d+$/.test(id);

  if (!isNumeric) {
    const error = new ValidationError(
      `ID '${id}'는 유효한 숫자 형식이어야 합니다.`
    );
    return next(error);
  }

  next();
};

// product PATCH를 위한 데이터 필드 검증
export const validateProductUpdateInfo = (req, res, next) => {
  try {
    const body = req.body || {};
    const { name, price, description, tags } = body;

    // 1. 데이터 타입 검증 (전달된 필드만 검사)
    checkDataType(body, "name", "string");
    checkDataType(body, "price", "number");
    if (description !== undefined) {
      checkDataType(body, "description", "string");
    }

    // tags 배열 및 내부 요소 타입 검증
    if (tags !== undefined) {
      checkDataType(body, "tags", "object");

      if (Array.isArray(tags)) {
        tags.forEach((tag, index) => {
          if (typeof tag !== "string") {
            throw new ValidationError(
              `필드 'tags'의 ${index}번째 요소는 문자열 타입이어야 합니다.`
            );
          }
        });
      } else {
        throw new ValidationError(`필드 'tags'는 배열 타입이어야 합니다.`);
      }
    }

    // 2. 수정할 필드가 없는지 (빈 요청인지) 검증
    const validKeys = ["name", "price", "description", "tags"];
    const hasUpdateFields = Object.keys(body).some((key) =>
      validKeys.includes(key)
    );

    if (!hasUpdateFields) {
      throw new ValidationError("수정할 필드가 요청 본문에 포함되어야 합니다.");
    }

    next();
  } catch (error) {
    next(error);
  }
};

// article PATCH를 위한 데이터 필드 검증
export const validateArticleUpdateInfo = (req, res, next) => {
  try {
    const body = req.body || {};
    const { title, content } = body;

    // 데이터 타입 검증: 전달된 필드가 string 타입인지 확인
    checkDataType(body, "title", "string");
    checkDataType(body, "content", "string");

    // 수정할 필드가 없는지 (빈 요청인지) 검증
    const validKeys = ["title", "content"];
    // body 객체의 키를 기반으로 유효한 수정 필드가 있는지 확인
    const hasUpdateFields = Object.keys(body).some((key) =>
      validKeys.includes(key)
    );

    if (!hasUpdateFields) {
      throw new ValidationError("수정할 필드가 요청 본문에 포함되어야 합니다.");
    }

    next();
  } catch (error) {
    next(error);
  }
};

export { ValidationError };

/**
 * 상품 댓글 등록/수정 요청 본문을 검증하는 미들웨어 (content 필드 검증)
 * @param {object} req - Express 요청 객체
 * @param {object} res - Express 응답 객체
 * @param {function} next - 다음 미들웨어 함수
 */
export const validateProductCommentInfo = (req, res, next) => {
  try {
    const body = req.body || {};

    // 1. 필수 필드 누락 검증 (content만 필수)
    checkRequiredFields(body, ["content"]);

    // 2. 데이터 타입 검증
    checkDataType(body, "content", "string");

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * 게시글 댓글 등록/수정 요청 본문을 검증하는 미들웨어 (content 필드 검증)
 * @param {object} req - Express 요청 객체
 * @param {object} res - Express 응답 객체
 * @param {function} next - 다음 미들웨어 함수
 */
export const validateArticleCommentInfo = (req, res, next) => {
  try {
    const body = req.body || {};

    // 1. 필수 필드 누락 검증 (content만 필수)
    checkRequiredFields(body, ["content"]);

    // 2. 데이터 타입 검증
    checkDataType(body, "content", "string");

    next();
  } catch (error) {
    next(error);
  }
};

export const validateCommentId = (req, res, next) => {
  const { commentId } = req.params;

  // 10진수 숫자 문자열인지 확인
  const isNumeric = /^\d+$/.test(commentId);

  if (!isNumeric) {
    // 유효하지 않은 형식(예: 'ffffffff')일 경우
    const error = new ValidationError(
      `댓글 ID '${commentId}'는 유효한 숫자 형식이어야 합니다.`
    );
    error.status = 404;
    return next(error);
  }

  // BigInt로 변환 시 오류가 날 수 있는 매우 큰 숫자인 경우 404 처리
  try {
    BigInt(commentId);
  } catch (e) {
    const error = new ValidationError(
      `댓글 ID '${commentId}'는 유효하지 않거나 너무 큰 값입니다.`
    );
    error.status = 404;
    return next(error);
  }

  next();
};

export const validateGetComments = (req, res, next) => {
  try {
    const { limit, cursor } = req.query;

    if (limit !== undefined) {
      const parsedLimit = parseInt(limit);

      if (isNaN(parsedLimit) || parsedLimit <= 0) {
        throw new ValidationError("limit 값은 1 이상의 정수여야 합니다.");
      }
    }

    if (cursor !== undefined) {
      if (typeof cursor !== "string") {
        throw new ValidationError("cursor 값은 문자열이어야 합니다.");
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
