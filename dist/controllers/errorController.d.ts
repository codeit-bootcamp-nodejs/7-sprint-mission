import { Request, Response, NextFunction } from 'express';
export declare function defaultNotFoundHandler(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>>;
export declare function globalErrorHandler(err: any, req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>>;
//# sourceMappingURL=errorController.d.ts.map