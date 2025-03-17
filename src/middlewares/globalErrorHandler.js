
const logger = require("../utils/logger");
const { ApiResponse, ApiError } = require("../utils/responseHandler");

const globalErrorHandler = (err, req, res, next) => {
    logger.error(err.message);
    const stack = err.stack;
    const message = err.message;
    const status = err.status ? err.status : "failed";
    const statusCode = err.statusCode ? err.statusCode : 500;
    res.status(statusCode).json({
        status,
        statusCode,
        message,
        stack,
    });
};

const notFoundError = (req, res, next) => {
    return ApiResponse.error(res, `can't find ${req.originalUrl} on the server`, 404)
};

module.exports = { globalErrorHandler, notFoundError };
