import { Request, Response } from 'express';
import { create } from 'superstruct';
import { registerBodyStruct, loginBodyStruct } from '../structs/authStruct';
import { authService } from '../services/authService';
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '../lib/constants';
import {generateTokens, verifyToken} from '../lib/token';
import { userRepository } from '../repositories/userRepository';
import BadRequestError from '../lib/errors/BadRequestError';

export async function register(req: Request, res: Response) {
    const data = create(req.body, registerBodyStruct);
    const user = await authService.register(data);
    return res.status(201).send(user);
}

export async function login(req: Request, res: Response) {
    const data = create(req.body, loginBodyStruct);
    const { user, accessToken, refreshToken } = await authService.login(data);
    res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24});
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7});
    return res.status(200).send(user);
}

export async function logout(req: Request, res: Response) {
    res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
    return res.status(200).send('로그아웃 되었습니다.');
}

export async function refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

    if(!refreshToken) {
        throw new BadRequestError('Refresh token not found');
    }

    const decoded = verifyToken(refreshToken);
    if(!decoded) {
        throw new BadRequestError('Invalid refresh token');
    }
    
    const user = await userRepository.findById(decoded.id);
    if(!user) {
        throw new BadRequestError('User not found');
    }

    const tokens = generateTokens(user.id);
    res.cookie(ACCESS_TOKEN_COOKIE_NAME, tokens.accessToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24});
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7});
    
    return res.send(tokens);
}