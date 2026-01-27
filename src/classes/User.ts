import { UnauthorizedError } from '../lib/errors/UnauthorizedError';
import { Request } from 'express';
import { UserData, UserParam } from '../lib/types/authType';

export class User {
    readonly id: string;
    readonly email: string;
    readonly nickname: string;
    readonly image: string | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    constructor({ id, email, nickname, image, createdAt, updatedAt }: UserParam) {
        this.id = id;
        this.email = email;
        this.nickname = nickname;
        this.image = image;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static fromEntity(user: UserData | null): User {
        if (!user) throw new Error('데이터가 존재하지 않습니다.');
        return new User({
            id: user.id.toString(),
            email: user.email,
            nickname: user.nickname,
            image: user.image,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }
    static fromEntityList(users: UserData[] = []): User[] {
        return users.map(User.fromEntity);
    }
}

export function assertUserId(req: Request): string {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedError('로그인이 필요한 서비스입니다.');
    return userId;
}
