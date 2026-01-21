export type RegisterDto = {
  email: string;
  nickname: string;
  password: string;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type RefreshDto = {
  refreshToken: string;
};
