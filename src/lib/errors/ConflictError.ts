import { CustomError } from './CustomError';
export class ConflictError extends CustomError {
  constructor(message = '이미 존재하는 데이터입니다.') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}
