import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './constants.js';

export function generateTokens(userId) {
    const accessToken = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (e) {
        return null;
    }
}