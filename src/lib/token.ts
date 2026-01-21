import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from './constants';

interface TokenPayload extends JwtPayload {
    id: number;
}
export function generateTokens(userId: number) {
    const accessToken = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
}

export function verifyToken(token: string): TokenPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded as TokenPayload;
    } catch (e) {
        return null;
    }
}