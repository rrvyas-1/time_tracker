
const { verifyToken } = require("../utils/helper");
const { ApiResponse } = require("../utils/responseHandler");

const isAuthenticated = (model) => {
    return async (req, res, next) => {
        const headerObj = req.headers;
        const token = headerObj.authorization
            ? headerObj.authorization.split(" ")[1]
            : "";
        const verifiedToken = verifyToken(token);
        if (verifiedToken) {
            const user = await model
                .findById(verifiedToken.id)
                .select("name email role");
            req.userAuth = user;
            next();
        } else {
            return ApiResponse.error(res, "Token Expired/Invalid", 401)
        }
    };
};

module.exports = isAuthenticated;
