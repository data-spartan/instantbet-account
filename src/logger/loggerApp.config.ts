import { createLogger, format, transports } from 'winston';

//THIS CONFIG FILE IS FOR GLOBAL APP LOGGER

// custom log display format
const customFormat = format.printf(
  ({ timestamp, level, stack, message, method, path }) => {
    if (path) {
      return `${timestamp} - [${level.toUpperCase()}] - ${
        message || stack
      } - ${method} - ${path}`;
    }
    return `${timestamp} - [${level.toUpperCase()}] - ${message || stack}`;
  },
);

// for development environment
const devLogger = {
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    customFormat,
  ),
  exitOnError: false,
  transports: [new transports.Console({ level: 'info' })],
};

// for production environment
const prodLogger = {
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json(),
  ),
  exitOnError: false,
  transports: [
    new transports.File({
      filename: 'app.log',
      dirname: `${process.env.APP_BASE_DIR}${process.env.LOG_DIR}`,
      maxsize: Number(process.env.LOG_MAXSIZE),
      maxFiles: Number(process.env.LOG_MAXFILES),
      level: 'info',
    }),
  ],
};

// export log instance based on the current environment
const instanceLogger =
  process.env.NODE_ENV !== 'production' ? devLogger : prodLogger;

export const instance = createLogger(instanceLogger);
