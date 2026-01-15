import type { NextFunction, Request, Response } from 'express';
import { StructError } from 'superstruct';
import BadRequestError from '../lib/errors/BadRequestError';
import NotFoundError from '../lib/errors/NotFoundError';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import ForbiddenError from '../lib/errors/ForbiddenError';

export function defaultNotFoundHandler(req: Request, res: Response) {
  return res.status(404).send({ message: 'Not found' });
}

export function globalErrorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof StructError) {
    return res.status(400).send({
      message: `Invalid ${err.path.join('.')}: ${err.message}`,
    });
  }

  if (
    err instanceof BadRequestError ||
    err instanceof UnauthorizedError ||
    err instanceof ForbiddenError ||
    err instanceof NotFoundError
  ) {
    return res
      .status(
        err instanceof BadRequestError
          ? 400
          : err instanceof UnauthorizedError
            ? 401
            : err instanceof ForbiddenError
              ? 403
              : 404,
      )
      .send({ message: err.message });
  }

  console.error(err);
  return res.status(500).send({ message: 'Internal server error' });
}
