import * as express from 'express';

declare global {
  namespace Express {
    // 기본 Request 인터페이스에 user 속성을 추가합니다.
    interface Request {
      user?: {
        id: number;
        email: string;
        nickname: string;
      };
    }
  }
}