import { NextFunction, Request, Response } from 'express';

type AsyncHandler = (req: Request, res: Response) => Promise<any> | any;

export function withAsync(handler: AsyncHandler) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await handler(req, res);
    } catch (e) {
      next(e);
    }
  };
}
