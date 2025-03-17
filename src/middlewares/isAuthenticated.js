
const { verifyToken } = require("../utils/helpers");

const isAuthenticated = (model) => {
    return async (req, res, next) => {
        //get token from header
        const headerObj = req.headers;
        const token = headerObj.authorization
            ? headerObj.authorization.split(" ")[1]
            : "";
        const verifiedToken = verifyToken(token);
        if (verifiedToken) {
            //save the user into req obj
            const user = await model
                .findById(verifiedToken.id)
                .select("name email role");
            req.userAuth = user;
            next();
        } else {
            const err = new Error("Token Expired/Invalid");
            err.statusCode = 401;
            next(err);
        }
    };
};

module.exports = isAuthenticated;
