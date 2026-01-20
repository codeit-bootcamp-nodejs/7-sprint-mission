import { Request, Response } from "express";
export declare function createArticle(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getArticle(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateArticle(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function deleteArticle(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getArticleList(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function createComment(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getCommentList(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function createLike(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function deleteLike(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=articlesController.d.ts.map