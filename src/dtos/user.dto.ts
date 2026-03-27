export interface UserResponseDto {
  id: number;
  email: string;
  nickname: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export function toUserDto(user: {
  id: number;
  email: string;
  nickname: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  password?: string;
  refreshToken?: string | null;
}): UserResponseDto {
  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    image: user.image,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
