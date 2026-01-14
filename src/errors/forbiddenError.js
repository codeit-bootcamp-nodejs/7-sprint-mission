import { AppError } from './error.js';

export class ForbiddenError extends AppError {
  constructor(message) {
    super(message, 403);
  }
}
