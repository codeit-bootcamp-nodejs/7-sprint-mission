import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { prismaClient } from "../lib/prismaClient.js";
import jwt from "jsonwebtoken";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, nickname } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prismaClient.user.create({
      data: { email, password: hashedPassword, nickname },
    });
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (e) {
    next(e);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "이메일이나 비번은 다 입력하세용" });
    }
    const user = await prismaClient.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "이메일이나 비번이 틀려용" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "비번이 잘못된듯ㅋ" });
    }
    const accessToken = jwt.sign(
      { id: user.id },
      process.env.JWT_ACCESS_TOKEN_SECRET!,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      message: "로그인성공",
      accessToken,
      user: { id: user.id, email: user.email },
    });
  } catch (e) {
    next(e);
  }
};

export async function refreshAccessToken(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ message: "토큰이 없어요" });
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as { id: number };
    const user = await prismaClient.user.findUnique({
      where: { id: decoded.id },
    });
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "유효하지 않은 토큰입니다." });
    }
    const newAccessToken = jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "토큰이 만료되었거나 유효하지 않습니다." });
  }
}
