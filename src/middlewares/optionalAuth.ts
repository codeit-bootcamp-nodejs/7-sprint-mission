import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../../utils/token.js";

export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) return next();

  const token = header.slice("Bearer ".length);

  try {
    const payload = verifyAccessToken(token);
    req.user = { userId: payload.userId };
  } catch {
  }

  next();
};
