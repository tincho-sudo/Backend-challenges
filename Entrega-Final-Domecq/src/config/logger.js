const winston = require("winston");
const { ENVIRONMENT } = require("../config/env");
const env = process.argv[4] || ENVIRONMENT || "DEV";
const { LogsDaoFactory } = require("../dao/factory");
const logsService = LogsDaoFactory.getDao();
let transports;

const winstonLevels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5,
  silly: 6,
};

const prodLogger = winston.createLogger({
  levels: winstonLevels,
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console({ level: "info" }),
    new winston.transports.File({
      filename: "./error.log",
      level: "error",
    }),
  ],
});

const devLogger = winston.createLogger({
  levels: winstonLevels,
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console({ level: "debug" }),
    new winston.transports.File({
      filename: "./error.log",
      level: "error",
    }),
  ],
});

const addLogger = async (req, _, next) => {
  switch (env) {
    case "DEV": {
      req.logger = devLogger;
      break;
    }
    case "PROD": {
      req.logger = prodLogger;
      break;
    }
    default: {
      req.logger = devLogger;
    }
  }
  req.logger.info(
    `${req.method} en ${
      req.url
    } - ${new Date().toLocaleDateString()} - Env: ${env}`
  );
  if (
    req.logger.transports[0].level === "error" ||
    req.logger.transports[0].level === "warning" ||
    req.logger.transports[0].level === "fatal"
  ) {
    logsService.newLog(
      `${req.method} en ${
        req.url
      } - ${new Date().toLocaleDateString()} - Env: ${env}`
    );
  }
  next();
};

module.exports = { addLogger };
