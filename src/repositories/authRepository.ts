import { prisma } from '../lib/prisma';
import { UpdateUserInput } from '../lib/types/authType';
import { Prisma } from '@prisma/client/extension';

export async function findUserByUserId(userId: string) {
    return prisma.user.findUnique({
        where: { id: BigInt(userId) },
    });
}

export async function findExistUser({
    userId,
    data,
}: {
    userId: string;
    data: Prisma.UserWhereInput[];
}) {
    return prisma.user.findFirst({
        where: {
            id: { not: BigInt(userId) },
            // OR: [
            //     user?.email ? { email: user.email } : undefined,
            //     user?.nickname ? { nickname: user.nickname } : undefined,
            // ].filter(Boolean) as any,
            OR: data,
        },
    });
}

export async function createUser({
    email,
    nickname,
    password,
}: {
    email: string;
    nickname: string;
    password: string;
}) {
    return prisma.user.create({
        data: {
            email,
            nickname,
            password,
        },
    });
}
export async function updateUser({ data, userId }: { data: UpdateUserInput; userId: string }) {
    return prisma.user.update({
        where: { id: BigInt(userId) },
        data: data,
        select: {
            id: true,
            email: true,
            nickname: true,
            image: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}

export async function updatePassword({ userId, password }: { userId: string; password: string }) {
    return prisma.user.update({
        where: { id: BigInt(userId) },
        data: { password },
    });
}

export async function findUserEmailOrNickname({
    email,
    nickname,
}: {
    email?: string;
    nickname?: string;
}) {
    return prisma.user.findFirst({
        where: {
            OR: [{ email }, { nickname }],
        },
    });
}
