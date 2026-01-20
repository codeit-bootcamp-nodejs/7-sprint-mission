import { CustomError } from './CustomError';
export class UnauthorizedError extends CustomError {
  constructor(message = '인증이 필요합니다.') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}
