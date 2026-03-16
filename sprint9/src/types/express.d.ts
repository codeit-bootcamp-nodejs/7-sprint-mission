import Express from 'express';

declare global {
  namespace MyApp {
    interface User {
        id: number; 
        email: string; 
        nickname: string; 
        image: string | null; 
        password: string; 
        createdAt: Date; 
        updatedAt: Date;
    }
  }
  namespace Express {
    interface Request {
        user?: MyApp.User;
    }
  }
}