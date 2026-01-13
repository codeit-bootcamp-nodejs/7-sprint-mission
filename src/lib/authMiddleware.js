import jwt from 'jsonwebtoken';
import { prismaClient } from './prismaClient.js';

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: '로그인이 필요합니다.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prismaClient.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return res.status(404).json({ message: '유저를 찾을 수 없습니다.' });
    
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};