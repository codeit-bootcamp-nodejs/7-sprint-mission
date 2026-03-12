import type {Request,Response,NextFunction } from "express";
type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown> | unknown;

export function withAsync(handler :AsyncHandler) {
  return async function (req :Request, res: Response, next: NextFunction) {
    try {
      await handler(req, res, next);
    } catch (e) {
      next(e);
    }
  };
}
