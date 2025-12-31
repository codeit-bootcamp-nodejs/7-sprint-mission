import dotenv from 'dotenv';
dotenv.config();

export const DATABASE_URL = process.env.DATABASE_URL;
export const PORT = process.env.PORT || 3000;
export const PUBLIC_PATH = './public';
export const STATIC_PATH = '/public';
export const ACCESS_TOKEN_COOKIE_NAME = 'access-token';
export const REFRESH_TOKEN_COOKIE_NAME = 'refresh-token';
export const JWT_SECRET = process.env.JWT_SECRET