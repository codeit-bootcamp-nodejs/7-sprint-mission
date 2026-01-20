import { User } from '@prisma/client';
import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
    cookies: Record<string, string>;
  }
}

export {};