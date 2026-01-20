declare global {
  namespace Express {
    interface Request {
      user?: Omit<PrismaUser, 'password'> | null;
      
    }
  }
}



export {};