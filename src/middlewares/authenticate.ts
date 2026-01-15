import type { Request, Response, NextFunction } from 'express';
import { prismaClient } from '../lib/prismaClient';
import { verifyAccessToken } from '../lib/token';
import { ACCESS_TOKEN_COOKIE_NAME } from '../lib/constants';

interface AuthenticateOptions {
  optional?: boolean;
}

function authenticate(options: AuthenticateOptions = { optional: false }) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
    if (!accessToken) {
      if (options.optional) {
        return next();
      }
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const payload = verifyAccessToken(accessToken);

      if (!payload || typeof payload === 'string' || !payload.userId) {
        throw new Error('Invalid token');
      }

      const user = await prismaClient.user.findUnique({
        where: { id: Number(payload.userId) },
      });

      if (!user) {
        if (options.optional) return next();
        return res.status(401).json({ message: 'Unauthorized' });
      }
      req.user = user;
    } catch (error) {
      if (options.optional) {
        return next();
      }
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  };
}

export default authenticate;
