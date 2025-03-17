
const bodyParser = require("body-parser");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const morganMiddleware = require("../middlewares/morganMiddleware");
const { globalErrorHandler, notFoundError } = require("../middlewares/globalErrorHandler");
const userRoutes = require("../routes/user.routes");
const sodEodRoutes = require("../routes/sodEod.routes");


const app = express();
app.use(morganMiddleware)
const corsOption = {
    origin: "*",
};
app.use(cors(corsOption));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use("/api/v1/uploads", express.static("uploads"));
baseUrl = "/api/v1/"
app.use(`${baseUrl}user`, userRoutes);
app.use(`${baseUrl}sod-eod`, sodEodRoutes);

//Not Found Error
app.use(notFoundError);
//Global Error Handler
app.use(globalErrorHandler);
module.exports = app;
