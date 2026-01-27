export class CustomError extends Error {
    readonly statusCode: number;
    readonly status: string;
    readonly isOperational: boolean;
    constructor(message : string, statusCode : number) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.name = this.constructor.name;
        this.isOperational = true;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
