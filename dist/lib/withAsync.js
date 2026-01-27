"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAsync = withAsync;
function withAsync(handler) {
    return async function (req, res, next) {
        try {
            await handler(req, res);
        }
        catch (e) {
            next(e);
        }
    };
}
//# sourceMappingURL=withAsync.js.map