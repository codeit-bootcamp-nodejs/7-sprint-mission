import { User } from '@prisma/client';

export type UserUpdateData = Partial<Pick<User, 'email' | 'nickname' | 'image'>>;

export type UserResponse = Omit<User, 'password'>;
