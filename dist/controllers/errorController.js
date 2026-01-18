"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultNotFoundHandler = defaultNotFoundHandler;
exports.globalErrorHandler = globalErrorHandler;
const superstruct_1 = require("superstruct");
const BadRequestError_1 = __importDefault(require("../lib/errors/BadRequestError"));
const NotFoundError_js_1 = __importDefault(require("../lib/errors/NotFoundError.js"));
const UnauthorizedError_1 = __importDefault(require("../lib/errors/UnauthorizedError"));
const ForbiddenError_1 = __importDefault(require("../lib/errors/ForbiddenError"));
function defaultNotFoundHandler(req, res, next) {
    return res.status(404).send({ message: 'Not found' });
}
function globalErrorHandler(err, req, res, next) {
    /** From superstruct or application error */
    if (err instanceof superstruct_1.StructError || err instanceof BadRequestError_1.default) {
        return res.status(400).send({ message: err.message });
    }
    /** From express.json middleware */
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).send({ message: 'Invalid JSON' });
    }
    /** Prisma error codes */
    if (err.code) {
        console.error(err);
        return res.status(500).send({ message: 'Failed to process data' });
    }
    /** Application errors */
    if (err instanceof NotFoundError_js_1.default) {
        return res.status(404).send({ message: err.message });
    }
    if (err instanceof UnauthorizedError_1.default) {
        return res.status(401).send({ message: err.message });
    }
    if (err instanceof ForbiddenError_1.default) {
        return res.status(403).send({ message: err.message });
    }
    console.error(err);
    return res.status(500).send({ message: 'Internal server error' });
}
//# sourceMappingURL=errorController.js.map