import { AppError } from "./error.js";

export class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404);
  }
}
