import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '../lib/constants.js';
import { prismaClient } from '../lib/prismaClient.js';
import { verifyAccessToken } from '../lib/token.js';

export function authenticate({ optional = false } = {}) {
  // 로그인은 했고, 권한 인가
  // 1. 토큰이 있는지 없는지 체크
  return async (req, res, next) => {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
    if (!accessToken) {
      return res.status(401).json('로그인 필요');
    }
    try {
      // 2. 유효기간을 넘지 않았는지 체크
      // 3. 내가 발급한 토큰이 맞는지 체크
      const { userId } = verifyAccessToken(accessToken);

      // 4. DB에서 해당 유저가 실제로 존재하는지 체크, req.user에 유저 정보 할당
      const user = await prismaClient.user.findUnique({ where: { id: userId } });
      if (!user && !optional) {
        return res.status(401).json('존재하지 않는 유저입니다.');
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json('유효하지 않은 토큰');
    }
  };
}
