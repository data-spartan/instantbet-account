import { createLogger, format, transports } from 'winston';

// custom log display format
const customFormat = format.printf(({ timestamp, level, stack, message }) => {
  return `${timestamp} - [${level.toUpperCase().padEnd(7)}] - ${
    stack || message
  }`;
});

// for development environment
const devLogger = {
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    customFormat,
  ),
  transports: [new transports.Console({ level: 'info' })],
};

// for production environment
const prodLogger = {
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json(),
  ),
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
