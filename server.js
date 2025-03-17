require("dotenv").config();
require("./src/config/dbConfig")

const http = require("http");
const logger = require("./src/utils/logger");
const app = require("./src/app/app");
const PORT = process.env.PORT;

const server = http.createServer(app);
server.listen(PORT, logger.info(`Server is Running on ${PORT}`));