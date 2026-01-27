import { CustomError } from './CustomError';
export class BadRequestError extends CustomError {
  constructor(message: string = '잘못된 요청입니다.') {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}
