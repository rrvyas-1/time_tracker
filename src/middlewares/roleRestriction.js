const roleRestriction = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.userAuth.role)) {
            const err = new Error("You do not have permission to access it");
            next(err);
        }
        next();
    };
};

module.exports = roleRestriction;