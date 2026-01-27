import bcrypt from 'bcrypt';
import { ConflictError } from '../lib/errors/ConflictError';
import { User } from '../classes/User';
import { generateTokens, setTokenCookies } from '../lib/token';
import { Response } from 'express';
import { BadRequestError } from '../lib/errors/BadRequestError';
import * as authRepository from '../repositories/authRepository';
import { NotFoundError } from '../lib/errors/NotFoundError';
import { UpdateUserInput, UserParam } from '../lib/types/authType';
import { Prisma } from '@prisma/client/extension';

export async function loginUser({ user, res }: { user: Express.User; res: Response }) {
    const { accessToken, refreshToken } = generateTokens(user.id);
    setTokenCookies(res, accessToken, refreshToken);
    return user;
}
export async function createUser({
    password,
    email,
    nickname,
}: {
    password: string;
    email: string;
    nickname: string;
}) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await authRepository.findUserEmailOrNickname({ email, nickname });
    if (existingUser) {
        if (existingUser.email === email) {
            throw new ConflictError('이미 가입된 이메일입니다.');
        }
        if (existingUser?.nickname === nickname) {
            throw new ConflictError('이미 사용 중인 닉네임입니다.');
        }
    }
    try {
        const data = await authRepository.createUser({ email, nickname, password: hashedPassword });
        return User.fromEntity(data);
    } catch (error: any) {
        throw error;
    }
}

export async function updateUser({
    currentUser,
    data,
    userId,
}: {
    currentUser: UserParam;
    data: UpdateUserInput;
    userId: string;
}) {
    const actualChanges = getActualChanges(currentUser, data);
    if (Object.keys(actualChanges).length === 0) {
        throw new BadRequestError('수정된 내용이 없습니다.');
    }

    const { email, nickname } = actualChanges;

    if (email || nickname) {
        const checkConditions: Prisma.UserWhereInput[] = [];
        if (email) checkConditions.push({ email });
        if (nickname) checkConditions.push({ nickname });

        const existingUser = await authRepository.findExistUser({ userId, data: checkConditions });
        if (existingUser) {
            if (existingUser.email === email) {
                throw new ConflictError('이미 가입된 이메일입니다.');
            }
            if (existingUser.nickname === nickname) {
                throw new ConflictError('이미 사용 중인 닉네임입니다.');
            }
        }
    }
    const updatedUser = await authRepository.updateUser({ data: actualChanges, userId });
    return User.fromEntity(updatedUser);
}

export async function changePassword(currentPassword: string, newPassword: string, userId: string) {
    if (currentPassword === newPassword) {
        throw new BadRequestError('새 비밀번호는 현재 비밀번호와 다르게 설정해야 합니다.');
    }
    const user = await authRepository.findUserByUserId(userId);
    if (!user) {
        throw new NotFoundError('User', Number(userId));
    }
    // 기존 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
        throw new BadRequestError('현재 비밀번호가 일치하지 않습니다.');
    }
    // 새 비밀번호 암호화 및 저장
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await authRepository.updatePassword({ userId, password: hashedNewPassword });
}

export async function refreshTokens(userId: string, res: Response) {
    const { accessToken, refreshToken } = generateTokens(userId);
    setTokenCookies(res, accessToken, refreshToken);
}

function getActualChanges<T extends object>(current: T, next: Partial<T>): Partial<T> {
    const changes: Partial<T> = {};

    (Object.keys(next) as Array<keyof T>).forEach((key) => {
        const newValue = next[key];
        const currentValue = current[key];

        // 값이 정의되어 있고, 기존 값과 다를 때만 포함
        if (newValue !== undefined && newValue !== null && newValue !== currentValue) {
            changes[key] = newValue;
        }
    });

    return changes;
}
