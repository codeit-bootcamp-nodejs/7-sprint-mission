import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import BadRequestError from '../lib/errors/BadRequestError.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';

export function defaultNotFoundHandler(_req: Request, res: Response, _next: NextFunction) {
  return res.status(404).send({ message: 'Not found' });
}

export function globalErrorHandler(err: Error & { code?: string; status?: number }, _req: Request, res: Response, _next: NextFunction) {
  /** From Zod or application error */
  if (err instanceof ZodError) {
    return res.status(400).send({ message: err.issues[0].message });
  }

  if (err instanceof BadRequestError) {
    return res.status(400).send({ message: err.message });
  }

  /** From express.json middleware */
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).send({ message: 'Invalid JSON' });
  }

  /** Prisma error codes */
  if (err.code) {
    console.error(err);
    return res.status(500).send({ message: 'Failed to process data' });
  }

  /** Application errors */
  if (err instanceof NotFoundError) {
    return res.status(404).send({ message: err.message });
  }

  if (err instanceof UnauthorizedError) {
    return res.status(401).send({ message: err.message });
  }

  if (err instanceof ForbiddenError) {
    return res.status(403).send({ message: err.message });
  }

  console.error(err);
  return res.status(500).send({ message: 'Internal server error' });
}
