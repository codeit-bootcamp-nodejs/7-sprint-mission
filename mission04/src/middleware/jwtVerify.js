import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/prisma.js";

export const accessTokenVerify = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    return res.status(401).json({ message: "not exists accessToken" });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (e) {
    return res.status(401).json({
      message: "유효하지 않은 토큰입니다",
    });
  }
});

export const refreshTokenVerify = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    return res.status(401).json({ message: "not exists refreshToken" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user || user.refresh_token !== refreshToken) {
      return res.status(401).json({
        message: "유효하지 않은 Refresh Token입니다. 다시 로그인해주세요.",
      });
    }

    req.user = {
      id: user.id,
      role: user.role,
    };

    next();
  } catch (e) {
    return res.status(401).json({
      message: "Refresh Token이 만료되었습니다. 다시 로그인해주세요.",
    });
  }
});
