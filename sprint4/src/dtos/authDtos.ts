import { User } from '@prisma/client';

export type UserCreateData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

export type UserResponse = Omit<User, 'password'>;

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}
