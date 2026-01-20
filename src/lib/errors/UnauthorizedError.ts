class UnauthorizedError extends Error {
  name: string;

  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';

    Object.setPrototypeOf(this, UnauthorizedError.prototype); 
  }
}

export default UnauthorizedError;
