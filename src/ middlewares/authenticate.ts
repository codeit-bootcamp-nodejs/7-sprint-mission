import type { RequestHandler } from "express";
import { ACCESS_TOKEN_COOKIE_NAME } from "../lib/constants.js";
import { verifyAccessToken } from "../lib/token.js";
import { prisma } from "../lib/prismaClient.js";

type AuthenticateOptions = {
  optional?: boolean;
};

export function authenticate(
  options: AuthenticateOptions = {}
): RequestHandler {
  const { optional = false } = options;

  return async (req, res, next) => {
    const token = req.cookies?.[ACCESS_TOKEN_COOKIE_NAME];

    if (!token) {
      if (options) return next();
      return res.status(401).json({ message: "토큰 없음" });
    }

    try {
      const { userId } = verifyAccessToken(token);

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });
      if (!user) return res.status(401).json({ message: "유저 없음" });
      req.user = { id: user.id };

      return next();
    } catch {
      return res.status(401).json({ message: "유효하지 않은 토큰" });
    }
  };
}
