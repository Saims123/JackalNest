"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function errorMiddleware(error, request, response, next) {
    const status = error.status || 500;
    const message = error.message || 'Encounter error';
    response.status(status).send({
        status,
        message
    });
}
exports.default = errorMiddleware;
//# sourceMappingURL=error-middleware.js.map