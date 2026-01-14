import { verifyAccessToken } from "../../utils/token.js";
import { UnauthorizedError } from "../../errors/customErrors.js";

export const auth = (req, res, next) => {
  const header = req.headers.authorization;
 
  if (!header?.startsWith("Bearer ")) {
    throw new UnauthorizedError("인증이 필요합니다.");
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: BigInt(payload.userId) };
    next();
  } catch {
    throw new UnauthorizedError("유효하지 않은 토큰입니다.");
  }
};
