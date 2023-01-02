"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlerMiddleware = void 0;
const http_status_codes_1 = require("http-status-codes");
const errorHandlerMiddleware = (error, req, res, next) => {
    if (error.status === http_status_codes_1.StatusCodes.BAD_REQUEST || error.status === http_status_codes_1.StatusCodes.NOT_FOUND) {
        return res.status(error.status).json({
            message: error.message,
            name: error.name
        });
    }
    return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong',
        name: 'Internal Server Error',
    });
};
exports.errorHandlerMiddleware = errorHandlerMiddleware;
