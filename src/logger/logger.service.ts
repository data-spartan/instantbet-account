import { LoggerService as loggService } from '@nestjs/common';

import { WinstonModule } from 'nest-winston';
import { instance } from './loggerApp.config';

//THIS LOGGER SERV FILE IS FOR GLOBAL APP LOGGER
export class LoggerService implements loggService {
  private logger: loggService;

  constructor() {
    this.logger = WinstonModule.createLogger({
      ...instance,
    });
  }

  log(message: any, fields?: any) {
    this.logger.log(message, fields);
  }
  error(message: any, fields?: any) {
    this.logger.error(message, fields);
  }
  warn(message: any, fields?: any) {
    this.logger.warn(message, fields);
  }
  debug(message: any, fields?: any) {
    this.logger.debug(message, fields);
  }
  verbose(message: any, fields?: any) {
    this.logger.verbose(message, fields);
  }
}
