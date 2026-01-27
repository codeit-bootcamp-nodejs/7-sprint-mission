// src/types/express.d.ts
import 'express';

declare global {
    namespace Express {
        interface User {
            id: string;
            email: string;
            nickname: string;
            image: string | null;
            createdAt: Date;
            updatedAt: Date;
        }

        interface Request {
            user?: User;
            file?: Multer.File;
            files?: Multer.File[] | { [fieldname: string]: Multer.File[] };
        }
    }
}

export {};
