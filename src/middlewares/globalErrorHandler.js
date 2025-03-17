
const logger = require("../utils/logger");

const globalErrorHandler = (err, req, res, next) => {
    logger.error(err.message);
    const stack = err.stack;
    const message = err.message;
    const status = err.status ? err.status : "failed";
    const statusCode = err.statusCode ? err.statusCode : 500;
    res.status(statusCode).json({
        status,
        message,
        stack,
    });
};

const notFoundError = (req, res, next) => {
    const err = new Error(`can't find ${req.originalUrl} on the server`);
    err.statusCode = 404;
    next(err);
};

module.exports = { globalErrorHandler, notFoundError };
