import { StructError } from 'superstruct';
import { BadRequestError } from '../lib/errors/BadRequestError.js';
import NotFoundError from '../lib/errors/NotFoundError.js';

export const defaultNotFoundHandler = (req, res) => {
  res.status(404).json({ message: 'Not found' });
};

export const globalErrorHandler = (err, req, res, next) => {
  if (err instanceof StructError || err instanceof BadRequestError) {
    return res.status(400).json({ message: err.message });
  }
  if (err instanceof NotFoundError) {
    return res.status(404).json({ message: err.message });
  }
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON' });
  }

  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
};