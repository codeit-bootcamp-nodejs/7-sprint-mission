import { assert, create } from 'superstruct';
import {
    ChangePasswordBodyStruct,
    RegisterBodyStruct,
    UpdateMeBodyStruct,
} from '../structs/authStructs';
import { clearTokenCookies } from '../lib/token';
import { UnauthorizedError } from '../lib/errors/UnauthorizedError';
import { assertUserId } from '../classes/User';
import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { UpdateUserInput } from '../lib/types/authType';

export async function login(req: Request, res: Response) {
    const user = req.user;
    if (!user) throw new UnauthorizedError('인증 정보가 없습니다.');
    const loginUser = await authService.loginUser({ user, res });

    res.json({
        message: '로그인 성공',
        data: { id: loginUser.id, email: loginUser.email },
    });
}

export async function register(req: Request, res: Response) {
    // 1. 데이터 유효성 검사
    const { email, nickname, password } = req.body;
    assert({ email, nickname, password }, RegisterBodyStruct);

    const createdUser = await authService.createUser({ email, nickname, password });

    res.status(201).json({
        message: '회원가입 성공',
        data: { id: createdUser.id, email: createdUser.email },
    });
}

export function logout(req: Request, res: Response) {
    clearTokenCookies(res);

    res.json({
        message: '로그아웃 되었습니다.',
    });
}

export async function me(req: Request, res: Response) {
    const user = req.user;

    if (!user) {
        throw new UnauthorizedError('로그인이 필요한 서비스입니다.');
    }
    res.json({
        data: user,
    });
}

export async function updateMe(req: Request, res: Response) {
    const data = create(req.body, UpdateMeBodyStruct) as UpdateUserInput;
    const userId = assertUserId(req);
    const currentUser = req.user;
    if (!currentUser) throw new UnauthorizedError('유저 정보가 없습니다.');
    const updatedUser = await authService.updateUser({ currentUser, data, userId });

    res.json({
        data: updatedUser,
    });
}

export async function changePassword(req: Request, res: Response) {
    const { currentPassword, newPassword } = create(req.body, ChangePasswordBodyStruct);
    const userId = assertUserId(req);

    await authService.changePassword(currentPassword, newPassword, userId);

    res.json({
        message: '비밀번호가 성공적으로 변경되었습니다.',
    });
}

export async function refreshTokens(req: Request, res: Response) {
    const userId = assertUserId(req);
    await authService.refreshTokens(userId, res);
    res.status(200).json({
        message: '토큰이 성공적으로 재발급되었습니다.',
    });
}
