import { AppError } from "./error.js";

export class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}
