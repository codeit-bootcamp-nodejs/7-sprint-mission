import { Request, Response, NextFunction } from 'express';
declare function authenticate(options?: {
    optional: boolean;
}): (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export default authenticate;
//# sourceMappingURL=authenticate.d.ts.map