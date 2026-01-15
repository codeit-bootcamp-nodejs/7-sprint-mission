class BadRequestError extends Error {
  name: string;

  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export default BadRequestError;
