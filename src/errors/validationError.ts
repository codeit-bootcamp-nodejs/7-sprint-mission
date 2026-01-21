import { AppError } from './error';

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}
