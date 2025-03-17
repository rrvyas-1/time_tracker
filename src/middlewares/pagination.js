// model,populate

const pagination = (model, select, populate) => {
    return async (req, res, next) => {
        const queryParams = req.query;
        const page = Number(queryParams.page) || 1;
        const limit = Number(queryParams.limit) || 10;
        const skip = (page - 1) * limit;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        let total = await model.countDocuments();

        let modelQuery = model.find();

        if (populate) {
            modelQuery = modelQuery.populate(populate);
        }
        //filtering and Searching Category Wise
        if (req.body.categoryId) {
            modelQuery = modelQuery.find({
                categoryId: req.body.categoryId,
            });
            total = await model.find({ categoryId: req.body.categoryId });
        }

        //paginationResult
        const pagination = {};
        if (endIndex < total.length) {
            pagination.next = {
                page: page + 1,
                limit,
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit,
            };
        }

        let data = await modelQuery.find().skip(skip).limit(limit).select(select);
        res.result = {
            status: "ok",
            total: total.length,
            pagination,
            result: data.length,
            data,
        };
        next();
    };
};

module.exports = pagination;