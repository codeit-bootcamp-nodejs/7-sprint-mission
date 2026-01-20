import { NextFunction, Request, RequestHandler, Response } from "express";

export function withAsync(handler:RequestHandler):RequestHandler {
  return async function (req:Request, res:Response, next:NextFunction) {
    try {
      await handler(req, res, next);
    } catch (e) {
      next(e);
    }
  };
}
