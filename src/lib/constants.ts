import dotenv from 'dotenv';
dotenv.config();

const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || 'default_access_secret';
const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET || 'default_refresh_secret';

const ACCESS_TOKEN_COOKIE_NAME = process.env.ACCESS_TOKEN_COOKIE_NAME || 'access_token';
const REFRESH_TOKEN_COOKIE_NAME = process.env.REFRESH_TOKEN_COOKIE_NAME || 'refresh_token';
const PUBLIC_PATH = process.env.PUBLIC_PATH || 'public';
const STATIC_PATH = process.env.STATIC_PATH || 'static';
const PORT = Number(process.env.PORT) || 3000;
const JWT_ACCESS_TOKEN_EXPIRES = process.env.JWT_ACCESS_TOKEN_EXPIRES || '1h';
const JWT_REFRESH_TOKEN_EXPIRES = process.env.JWT_REFRESH_TOKEN_EXPIRES || '7d';
const NODE_ENV = process.env.NODE_ENV || 'DEV';
export {
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_COOKIE_NAME,
    REFRESH_TOKEN_COOKIE_NAME,
    JWT_ACCESS_TOKEN_EXPIRES,
    JWT_REFRESH_TOKEN_EXPIRES,
    PUBLIC_PATH,
    STATIC_PATH,
    PORT,
    NODE_ENV,
};
