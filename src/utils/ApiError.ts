export class ApiError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export const BadRequest = (message = 'Bad Request') => new ApiError(400, message);
export const Unauthorized = (message = 'Unauthorized') => new ApiError(401, message);
export const Forbidden = (message = 'Forbidden') => new ApiError(403, message);
export const NotFound = (message = 'Not Found') => new ApiError(404, message);
export const Conflict = (message = 'Conflict') => new ApiError(409, message);
export const InternalError = (message = 'Internal Server Error') => new ApiError(500, message);
