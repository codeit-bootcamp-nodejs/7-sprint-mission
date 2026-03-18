export declare class HttpError extends Error {
    constructor(statusCode: any, message: any);
}
export declare class BadRequestError extends HttpError {
    constructor(message?: string);
}
export declare class ForbiddenError extends HttpError {
    constructor(message?: string);
}
export declare class NotFoundError extends HttpError {
    constructor(message?: string);
}
export declare class ConflictError extends HttpError {
    constructor(message?: string);
}
export declare class InternalServerError extends HttpError {
    constructor(message?: string);
}
//# sourceMappingURL=errors.d.ts.map