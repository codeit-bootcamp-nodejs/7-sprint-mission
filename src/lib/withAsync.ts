import { Request, Response, NextFunction } from "express";

type asyncHandler = (req: Request, res: Response)=> Promise<void>;

export function withAsync(handler: asyncHandler) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await handler(req, res);
    } catch (e) {
      next(e);
    }
  };
}
