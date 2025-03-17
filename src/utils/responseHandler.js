class ApiResponse {
    constructor(status, message, data = null) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    static success(res, message, data = null, status = 200) {
        return res.status(status).json(new ApiResponse(status, message, data));
    }

    static error(res, message, status = 500) {
        return res.status(status).json(new ApiResponse(status, message));
    }
}

class ApiError extends Error {
    constructor(message, status = 500) {
        super(message);
        this.status = status;
    }
}

module.exports = { ApiResponse, ApiError };