// 이 클래스는 Error클래스를 상속하여 커스텀한 에러 클래스
export class HttpError extends Error {
  // statuscode와 메세지를 받음.
  constructor(statusCode, message) {
    // 메세지는 부모인 Error객체꺼 상속
    super(message);
    // statuscode는 새롭게 추가
    this.statusCode = statusCode;
    // 오류 이름 설정 -> 아직 이해가 부족.
    this.name = this.constructor.name;
    // 오류가 난 곳을 정확하게 알려줌.
    Error.captureStackTrace(this, this.constructor);
  }
}
// 400 Bad Request
export class BadRequestError extends HttpError {
  constructor(message = "잘못된 요청입니다.") {
    super(400, message);
  }
}

// 404 Not Found
export class NotFoundError extends HttpError {
  constructor(message = "요청한 리소스를 찾을 수 없습니다.") {
    super(404, message);
  }
}

// 500 Internal Server Error
export class InternalServerError extends HttpError {
  constructor(message = "서버 내부 오류가 발생했습니다.") {
    super(500, message);
  }
}
