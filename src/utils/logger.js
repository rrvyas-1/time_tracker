const winston = require("winston");
const { combine, timestamp, printf, colorize, align } = winston.format;

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: combine(
        colorize({
            all: true,
            level: true,
            message: true,
            colors: {
                silly: "magenta",
                debug: "blue",
                verbose: "cyan",
                info: "green",
                warn: "yellow",
                error: "red",
                http: "green",
            },
        }),
        timestamp({
            format: "DD-MM-YYYY hh:mm A",
        }),
        align(),
        printf((info) => `[${info.timestamp}]  ${info.level} : ${info.message}`)
    ),
    transports: [new winston.transports.Console({ level: "http" })],
});
module.exports = logger;