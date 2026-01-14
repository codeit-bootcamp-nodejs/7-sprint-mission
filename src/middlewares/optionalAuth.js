import { verifyAccessToken } from "../../utils/token.js";

export const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) return next();

  const token = header.slice("Bearer ".length);

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: BigInt(payload.userId) };
  } catch {
  }

  next();
};
