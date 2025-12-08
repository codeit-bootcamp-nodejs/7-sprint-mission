export class CustomError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.CustomError);
  }
}

//400 bad requset 에러 (사용자 입력 오류)
export class BadRequestError extends CustomError {
  constructor(message = "잘못된 입력 데이터입니다.") {
    super(400, message);
  }
}

//404 not found 에러
export class NotFoundError extends CustomError {
  constructor(message = "요청하신 리소스를 찾을 수 없습니다.") {
    super(404, message);
  }
}

//500 internal server error 서버에러
export class InternalServerError extends CustomError {
  constructor(message = "서버 내부 오류가 발생했습니다.") {
    super(500, message);
  }
}
