import { AppError } from './error';

export class UnauthenticatedError extends AppError {
  constructor(message: string) {
    super(message, 401);
  }
}
