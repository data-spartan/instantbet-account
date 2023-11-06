import { LoggerService as LS } from '@nestjs/common';
import * as winston from 'winston';

import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { instanceLogger } from './logger.app';

export class LoggerService implements LS {
  private logger: LS;

  constructor() {
    this.logger = WinstonModule.createLogger({
      ...instanceLogger,
    });
  }

  log(message: any, fields?: any) {
    this.logger.log(message);
  }
  error(message: any, fields?: any) {
    this.logger.error(message);
  }
  warn(message: any, fields?: any) {
    this.logger.warn(message);
  }
  debug(message: any, fields?: any) {
    this.logger.debug(message);
  }
  verbose(message: any, fields?: any) {
    this.logger.verbose(message);
  }
}
