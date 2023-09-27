// custom-logger.service.ts
import { Injectable, Scope, Logger, Inject } from '@nestjs/common';
import { transports, createLogger, format, LoggerOptions } from 'winston';
// import DailyRotateFile from 'winston-daily-rotate-file';

import * as winston from 'winston';
import { LoggerConfig } from './logger.config';
import { ConfigService } from '@nestjs/config';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends Logger {
  private logger;
  private BASE_DIR;
  private LOGS_DIR;
  private logLevel;
  // constructor(private readonly configService: ConfigService) {}

  constructor(
    context: string,
    private readonly configService: ConfigService,
    logLevel: string = configService.get<string>('DEFAULT_LOG_LEVEL'),
  ) {
    super();
    this.BASE_DIR = this.configService.get<string>('APP_BASE_DIR');
    this.LOGS_DIR = this.configService.get<string>('LOG_DIR');
    this.logLevel = logLevel;
    const config: any = new LoggerConfig(
      this.BASE_DIR,
      this.LOGS_DIR,
      context,
      this.logLevel,
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
