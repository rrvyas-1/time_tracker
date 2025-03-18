const bodyParser = require("body-parser");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const morganMiddleware = require("../middlewares/morganMiddleware");
const {
  globalErrorHandler,
  notFoundError,
} = require("../middlewares/globalErrorHandler");
const userRoutes = require("../routes/user.routes");
const sodEodRoutes = require("../routes/sodEod.routes");
const exphbs = require("express-handlebars");
const path = require("path");
const logger = require("../utils/logger");

const app = express();

app.use(morganMiddleware);
const corsOption = {
  origin: "*",
};
app.use(cors(corsOption));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use("/api/v1/uploads", express.static("uploads"));
baseUrl = "/api/v1/";
app.use(`${baseUrl}user`, userRoutes);
app.use(`${baseUrl}sod-eod`, sodEodRoutes);
app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'main',
  helpers: {
    log: function (data) {
      console.log("Handlebars Log:", data);
      return ""; // Handlebars requires a return value, so return an empty string
    },
  },
  // layoutsDir: __dirname + '/views/layouts/'
}));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../views"));
// Serve static files
app.use(express.static(path.join(__dirname, "../public")));

app.get("/login", (req, res) => {
  res.render("auth/login",);
});

app.get("/register", (req, res) => {
  res.render("auth/register", { layout: "main" });
});

app.get("/admin/dashboard", (req, res) => {
  res.render("admin/dashboard", { layout: "admin" });
});

app.get("/admin/users", (req, res) => {
  res.render("admin/users", { layout: "admin" });
});

app.get("/user/dashboard", (req, res) => {
  res.render("user/dashboard", { layout: "user" });
});
//Not Found Error
app.use(notFoundError);
//Global Error Handler
app.use(globalErrorHandler);
module.exports = app;
