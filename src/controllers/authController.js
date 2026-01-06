import { create } from 'superstruct';
import { prisma as prismaClient } from '../lib/prismaClient.js';
import BadRequestError from '../lib/errors/BadRequestError.js';
import { registerBodyStruct, loginBodyStruct } from '../structs/authStruct.js';
import bcrypt from 'bcrypt';
import { JWT_SECRET, ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '../lib/constants.js';
import {generateTokens, verifyToken} from '../lib/token.js';

export async function register(req, res) {
    const { email, nickname, password } = create(req.body, registerBodyStruct);

    const existingUser = await prismaClient.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new BadRequestError('이미 사용 중인 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prismaClient.user.create({
        data: {
            email,
            nickname,
            password: hashedPassword,
        },
    });

    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).send(userWithoutPassword);
}

export async function login(req, res) {
    const { email, password } = create(req.body, loginBodyStruct);

    const user = await prismaClient.user.findUnique({ where: { email } });
    if (!user) {
        throw new BadRequestError('이메일를 찾을 수 없습니다.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new BadRequestError('비밀번호가 일치하지 않습니다.');
    }
    
    const tokens = generateTokens(user.id); 
    res.cookie(ACCESS_TOKEN_COOKIE_NAME, tokens.accessToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24});
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7});

    const { password: _, ...userWithoutPassword } = user;
    return res.send(userWithoutPassword);
}

export async function logout(req, res) {
    res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
    return res.status(200).send('로그아웃 되었습니다.');
}

export async function refreshToken(req, res) {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

    if(!refreshToken) {
        throw new BadRequestError('Refresh token not found');
    }

    const decoded = verifyToken(refreshToken);
    if(!decoded) {
        throw new BadRequestError('Invalid refresh token');
    }
    
    const user = await prismaClient.user.findUnique({ where: { id: decoded.id } });
    if(!user) {
        throw new BadRequestError('User not found');
    }

    const tokens = generateTokens(user.id);
    res.cookie(ACCESS_TOKEN_COOKIE_NAME, tokens.accessToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24});
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7});
    
    return res.send(tokens);
}