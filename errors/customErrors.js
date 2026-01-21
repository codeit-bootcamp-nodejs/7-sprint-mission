export class HttpError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 Bad Request
export class BadRequestError extends HttpError {
  constructor(message = "잘못된 요청입니다.") {
    super(message, 400);
  }
}

// 401 Unauthorized
export class UnauthorizedError extends HttpError {
  constructor(message = "인증이 필요합니다.") {
    super(message, 401);
  }
}

// 403 Forbidden
export class ForbiddenError extends HttpError {
  constructor(message = "권한이 없습니다.") {
    super(message, 403);
  }
}

// 404 Not Found
export class NotFoundError extends HttpError {
  constructor(message = "요청한 리소스를 찾을 수 없습니다.") {
    super(message, 404);
  }
}

// 500 Internal Server Error
export class InternalServerError extends HttpError {
  constructor(message = "서버 내부 오류가 발생했습니다.") {
    super(message, 500);
  }
}
