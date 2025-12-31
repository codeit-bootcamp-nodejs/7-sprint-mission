import jwt from 'jsonwebtoken';
import { JWT_SECRET, ACCESS_TOKEN_COOKIE_NAME } from './constants.js';
import { prismaClient } from './prismaClient.js';
import { verifyToken } from './token.js';
import BadRequestError from './errors/BadRequestError.js';

export async function authenticate(option = { optional: false}){
    return async function(req, res, next){
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