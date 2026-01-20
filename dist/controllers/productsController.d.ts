import { Request, Response } from 'express';
export declare function createProduct(req: Request, res: Response): Promise<void>;
export declare function getProduct(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateProduct(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function deleteProduct(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getProductList(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function createComment(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getCommentList(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function createFavorite(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function deleteFavorite(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=productsController.d.ts.map