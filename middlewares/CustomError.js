export class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

export class ValidationError extends CustomError {
  constructor(message = '잘못된 요청입니다.') {
    super(message, 400);
  }
}

export class NotFoundError extends CustomError {
  constructor(message = '리소스를 찾을 수 없습니다.') {
    super(message, 404);
  }
}
