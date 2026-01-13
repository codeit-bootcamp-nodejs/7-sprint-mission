import { Request, Response, NextFunction } from 'express';
import { ACCESS_TOKEN_COOKIE_NAME } from './constants';
import { prisma as prismaClient } from './prismaClient';
import { verifyToken } from './token';
import BadRequestError from './errors/BadRequestError';

interface AuthenticateOptions {
  optional?: boolean;
}
export function authenticate(option: AuthenticateOptions = { optional: false}){
    return async function(req: Request, res: Response, next: NextFunction) {
        const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];

        if (!accessToken) {
            if (option.optional) {
                return next();
            }
            return res.status(401).send({ message: 'Unauthorized' });
        }
        const decoded = verifyToken(accessToken);
        if (!decoded) {
            if (option.optional) {
                return next();
            }
            return res.status(401).send({ message: 'Invalid token' });
        }
        try {
          const user = await prismaClient.user.findUnique({ where: { id: decoded.id } });
      if (!user) {
        throw new BadRequestError('User not found');
      }
      req.user = user; 
      next();
    } catch (e) {
      next(e);
    }
  };
}