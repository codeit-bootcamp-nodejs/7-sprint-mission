import type { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  code?: string; // Prisma 에러 코드 등을 위해 추가
}

export const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(err);

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      message: '요청한 데이터를 찾을 수 없습니다.',
    });
  }

  return res.status(500).json({
    message: '서버 내부 오류',
  });
};
