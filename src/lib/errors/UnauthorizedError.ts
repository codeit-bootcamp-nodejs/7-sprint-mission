class UnauthorizedError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
    this.status = 401;
  }
}

export default UnauthorizedError;
