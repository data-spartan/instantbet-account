// custom-logger.service.ts
import { Injectable, Scope, Logger, Inject } from '@nestjs/common';
import { transports, createLogger, format, LoggerOptions } from 'winston';
// import DailyRotateFile from 'winston-daily-rotate-file';

import * as winston from 'winston';
import { LoggerConfig } from './logger.config';
import { ConfigService } from '@nestjs/config';
import { LoggerGetParams } from './helpers/loggerGetParams.helper';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends Logger {
  private logger;

  constructor(
    context: string,
    private readonly configService: ConfigService,
  ) {
    super();

    const configParams = new LoggerGetParams(configService);
    const { BASE_DIR, LOGS_DIR, LOGS_MAXSIZE, LOGS_MAXFILES, LOGS_LEVEL } =
      configParams.getConfigParams();
    const config: any = new LoggerConfig(
      BASE_DIR,
      LOGS_DIR,
      LOGS_LEVEL,
      LOGS_MAXSIZE,
      LOGS_MAXFILES,
      context,
    ).getConfig();
    this.logger = createLogger(config);
  }

  log(message: any) {
    this.logger.info(message);
  }
  error(message: any) {
    this.logger.error(message);
  }
  warn(message: any) {
    this.logger.warn(message);
  }
}
