import { createLogger, format, transports } from 'winston';
import * as dotenv from 'dotenv';
dotenv.config();

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

const loggerFactory = (path: string) => {
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
        dirname: `${path}/${process.env.LOG_DIR}`,
        maxsize: +process.env.LOG_MAXSIZE,
        maxFiles: +process.env.LOG_MAXFILES,
        level: 'info',
      }),
    ],
  };
  const devLogger = {
    format: format.combine(
      format.timestamp(),
      format.errors({ stack: true }),
      customFormat,
    ),
    exitOnError: false,
    transports: [new transports.Console({ level: 'info' })],
  };
  return process.env.NODE_ENV !== 'production' ? devLogger : prodLogger;
};

export function loggerConfig(path: string) {
  const instanceLogger = loggerFactory(path);
  return createLogger(instanceLogger);
}
