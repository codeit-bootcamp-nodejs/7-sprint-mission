export type UserParam = {
    id: string;
    email: string;
    nickname: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
};

export type UserData = {
    id: bigint;
    email: string;
    nickname: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
};

export type CreateUserInput = Pick<UserParam, 'email' | 'nickname' | 'image'>;

export type UpdateUserInput = Partial<Pick<UserParam, 'email' | 'nickname' | 'image'>>;
