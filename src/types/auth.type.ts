export interface AuthPayload {
  userId: string;
  nickname: string;
}

export interface AuthDto {
  email: string;
  nickname: string;
  password: string;
}

export type LoginDto = {
  email: string;
  password: string;
};
