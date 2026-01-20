import { Request, Response, NextFunction } from "express";
type asyncHandler = (req: Request, res: Response) => Promise<void>;
export declare function withAsync(handler: asyncHandler): (req: Request, res: Response, next: NextFunction) => Promise<void>;
export {};
//# sourceMappingURL=withAsync.d.ts.map