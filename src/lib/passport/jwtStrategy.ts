import { Strategy as JwtStrategy, VerifiedCallback } from 'passport-jwt';
import {
    ACCESS_TOKEN_COOKIE_NAME,
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_COOKIE_NAME,
} from '../constants';
import { prisma } from '../prisma';
import type { Request } from 'express';
import { User } from '../../classes/User';

interface JwtPayload {
    id: string;
}

const accessTokenOptions = {
    jwtFromRequest: (req: Request) => req.cookies[ACCESS_TOKEN_COOKIE_NAME],
    secretOrKey: JWT_ACCESS_TOKEN_SECRET,
};

const refreshTokenOptions = {
    jwtFromRequest: (req: Request) => req.cookies[REFRESH_TOKEN_COOKIE_NAME],
    secretOrKey: JWT_REFRESH_TOKEN_SECRET,
};

async function jwtVerify(payload: JwtPayload, done: VerifiedCallback) {
    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: { id: BigInt(payload.id) },
        });
        done(null, User.fromEntity(user));
    } catch (err) {
        done(err, false);
    }
}

export const accessTokenStrategy = new JwtStrategy(accessTokenOptions, jwtVerify);

export const refreshTokenStrategy = new JwtStrategy(refreshTokenOptions, jwtVerify);
