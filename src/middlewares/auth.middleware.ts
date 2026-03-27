import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../config/jwt';
import { Unauthorized } from '../utils/ApiError';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(Unauthorized('Access token required'));
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    next(Unauthorized('Invalid or expired access token'));
  }
}
