const { ApiResponse } = require("../utils/responseHandler");

const roleRestriction = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.userAuth || !req.userAuth.role) {
            return ApiResponse.error(res, "Unauthorized: No user role found", 403);
        }
        if (!allowedRoles.includes(req.userAuth.role)) {
            return ApiResponse.error(res, "Forbidden: You don't have permission to access this", 403);
        }

        next();
    };
};

module.exports = roleRestriction;