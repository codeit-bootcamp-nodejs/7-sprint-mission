export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "잘못된 요청입니다.") {
    super(400, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "요청한 리소스를 찾을 수 없습니다.") {
    super(404, message);
  }
}

export class InternalServerError extends HttpError {
  constructor(message = "서버 내부 오류가 발생했습니다.") {
    super(500, message);
  }
}
