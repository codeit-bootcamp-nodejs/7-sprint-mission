import { Request, Response, NextFunction } from 'express';

export function defaultNotFoundHandler(req: Request, res: Response) {
  res.status(404).json({ message: '요청한 리소스를 찾을 수 없습니다' });
}

export function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err.status ?? 500;
  const message = err.message ?? '서버 내부 오류가 발생했습니다';
  res.status(status).json({ message });
}
