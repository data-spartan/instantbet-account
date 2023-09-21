// custom-logger.service.ts
import { Injectable, Logger, Scope } from '@nestjs/common';
import { transports, createLogger, format, LoggerOptions } from 'winston';
// import DailyRotateFile from 'winston-daily-rotate-file';

import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

/**
 * @description Configuration for Winston logger
 */
export class LoggerConfig {
  private readonly options: LoggerOptions;

  constructor(context: string) {
    this.options = {
      format: format.combine(format.timestamp(), format.json()),
      exitOnError: false,
      transports: [
        new winston.transports.File({
          filename: `${context}.log`,
          level: 'info',
          dirname: `src/logs/${context}`,
          maxsize: 100000000000000000,
          maxFiles: 10,
          //   zippedArchive: true,
        }),
      ],
    };
  }

  public getConfig(): winston.LoggerOptions {
    return this.options;
  }
}
@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends Logger {
  private logger;

  constructor(context: string) {
    super();
    const config: any = new LoggerConfig(context).getConfig();
    this.logger = createLogger(config);
  }

  log(message: any) {
    this.logger.info(message);
  }
  error(message: any) {
    this.logger.error(message);
  }
}
