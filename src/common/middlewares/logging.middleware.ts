import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private logger: LoggerService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, path } = request;
    const ingoingTimestamp = Date.now();

    response.on('finish', () => {
      if (!response.locals.errResp) {
        const { statusCode, message } = response.locals.loggingData;
        const processingTime = Date.now() - ingoingTimestamp;

        this.logger.log({ statusCode, message, path, method, processingTime });
      } else {
        this.logger.error(response.locals.errResp);
      }
    });

    next();
  }
}
