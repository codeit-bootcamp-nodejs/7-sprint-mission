import jwt from 'jsonwebtoken';
import {
    ACCESS_TOKEN_COOKIE_NAME,
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_COOKIE_NAME,
} from './constants';
import { Response } from 'express';

function generateTokens(userId: string) {
    const accessToken = jwt.sign({ id: userId }, JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: '1h',
    });
    const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: '1d',
    });
    return { accessToken, refreshToken };
}
function setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
    const ONE_HOUR = 60 * 60 * 1000;
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
    res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
        httpOnly: true,
        maxAge: ONE_HOUR,
    });

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
        httpOnly: true,
        maxAge: SEVEN_DAYS,
        path: '/auth/refresh',
    });
}
function clearTokenCookies(res: Response) {
    res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, { path: '/auth/refresh' });
}

export { generateTokens, setTokenCookies, clearTokenCookies };
