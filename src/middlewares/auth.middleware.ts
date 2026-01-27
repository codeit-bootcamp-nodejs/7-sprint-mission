import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { VerifyErrors } from "jsonwebtoken";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "로그인이 필요해" });
  }
  jwt.verify(
    token,
    process.env.JWT_ACCESS_TOKEN_SECRET!,
    (err: VerifyErrors | null, user: any) => {
      if (err) {
        return res.status(403).json({ message: "유효하지 않은 토큰" });
      }
      (req as any).user = user;
      next();
    }
  );
};
