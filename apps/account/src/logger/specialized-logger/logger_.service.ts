// custom-logger.service.ts
import { Injectable, Scope, Logger } from '@nestjs/common';
import { createLogger } from 'winston';
// import DailyRotateFile from 'winston-daily-rotate-file';

import { LoggerConfig } from './logger.config';
import { ConfigService } from '@nestjs/config';
import { LoggerGetParams } from '../helpers/loggerGetParams.helper';

//THIS IS FOR SPECIALIZED LOGGS. E.G. IF WE WANT EACH MODULE HAS ITS OWN LOGGING(separate log files)

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerServi extends Logger {
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
