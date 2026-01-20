import { StructError } from 'superstruct';
import BadRequestError from '../lib/errors/BadRequestError';
import NotFoundError from '../lib/errors/NotFoundError';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import { NextFunction } from 'express';
import { Request, Response } from 'express';

export function defaultNotFoundHandler(req: Request, res: Response, next: NextFunction) {
  return res.status(404).send({ message: 'Not found' });
}

export function globalErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  /** From superstruct or application error */
  if (err instanceof StructError || err instanceof BadRequestError) {
    return res.status(400).send({ message: err.message });
  }

  /** From express.json middleware */
  if (err instanceof SyntaxError && (err as any).status === 400 && 'body' in err) {
    return res.status(400).send({ message: 'Invalid JSON' });
  }

  /** Prisma error codes */
  if ((err as any).code) {
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
