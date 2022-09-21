import winston from 'winston'

const buildProdLogger = () => {
  const prodLogger = winston.createLogger({
    transports: [
      new winston.transports.File({ filename: "error.log", level: "error" }),
      new winston.transports.File({ filename: "warn.log", level: "warn" }),
      new winston.transports.Console({ level: "verbose" }),
    ],
  });

  return prodLogger;
};

let logger;

logger = buildProdLogger();


export default logger;
