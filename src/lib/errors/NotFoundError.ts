import { object } from "superstruct";

class NotFoundError extends Error {
  name: string;

  constructor(modelName: String, id: number | string) {
    super(`${modelName} with id ${id} not found`);
    this.name = 'NotFoundError';

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export default NotFoundError;
