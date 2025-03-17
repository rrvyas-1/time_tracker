
const bodyParser = require("body-parser");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const morganMiddleware = require("../middlewares/morganMiddleware");
const { globalErrorHandler, notFoundError } =require("../middlewares/globalErrorHandler")


const app = express();
app.use(morganMiddleware)
const corsOption = {
    origin: "*",
};
app.use(morgan("dev"));
app.use(cors(corsOption));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use("/api/v1/uploads", express.static("uploads"));

// app.use("/api/v1/admin/", adminRoutes);
// app.use("/api/v1/category/", categoryRoutes);
// app.use("/api/v1/wallpaper/", wallPaperRoutes);
// app.use("/api/v1/user/", userRoutes);
// app.use("/api/v1/query/", userQueryRoutes);

//Not Found Error
app.use(notFoundError);
//Global Error Handler
app.use(globalErrorHandler);
module.exports = app;
