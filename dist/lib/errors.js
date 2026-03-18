"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.BadRequestError = exports.HttpError = void 0;
class HttpError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.HttpError = HttpError;
class BadRequestError extends HttpError {
    constructor(message = "잘못된 요청입니다.") {
        super(400, message);
    }
}
exports.BadRequestError = BadRequestError;
class ForbiddenError extends HttpError {
    constructor(message = "접근 권한이 없습니다.") {
        super(403, message);
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends HttpError {
    constructor(message = "요청한 리소스를 찾을 수 없습니다.") {
        super(404, message);
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends HttpError {
    constructor(message = "이미 존재하는 데이터입니다.") {
        super(409, message);
    }
}
exports.ConflictError = ConflictError;
class InternalServerError extends HttpError {
    constructor(message = "서버 내부 오류가 발생했습니다.") {
        super(500, message);
    }
}
exports.InternalServerError = InternalServerError;
//# sourceMappingURL=errors.js.map