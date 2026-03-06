export const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
export const PUBLIC_PATH = 'public';
export const STATIC_PATH = '/static';

export const JWT_SECRET = process.env.JWT_SECRET ?? 'panda-market-secret';
export const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ?? 'panda-market-refresh-secret';
export const JWT_ACCESS_EXPIRES_IN = '1h';
export const JWT_REFRESH_EXPIRES_IN = '7d';
