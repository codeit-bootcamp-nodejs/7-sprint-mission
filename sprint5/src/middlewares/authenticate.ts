import { prismaClient } from '../lib/prismaClient.js';
import { verifyAccessToken } from '../lib/token.js';
import { ACCESS_TOKEN_COOKIE_NAME } from '../lib/constants.js';
import type { Request, Response, NextFunction } from 'express';

function authenticate(options = { optional: false }) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
    if (!accessToken) {
      if (options.optional) {
        return next();
      }
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const { userId } = verifyAccessToken(accessToken);
      const user = await prismaClient.user.findUnique({ where: { id: userId } });
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
