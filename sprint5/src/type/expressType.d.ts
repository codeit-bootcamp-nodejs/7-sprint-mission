// Prisma의 User 타입
import type { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      //모든 HTTP 요청이 로그인을 필요로 하지는 않음
      //"user라는 속성이 Request 객체에 있을 수도 있고, 없을 수도 있다"
      user?: User | null;
    }
  }
}
