import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Access Token 
export function generateAccessToken(userId) {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

// Refresh Token 
export function generateRefreshToken(userId) {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

//토큰 복호화
export function verifyAccessToken(token) {
  const decoded = jwt.verify(token, JWT_SECRET);
  return { userId: decoded.userId };
}

export function verifyRefreshToken(token) {
  const decoded = jwt.verify(token, JWT_SECRET);
  return { userId: decoded.userId };
}


