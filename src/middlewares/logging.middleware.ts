import { Request, Response, NextFunction } from 'express';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
// import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private logger: Logger) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, baseUrl } = response.req;
    const ingoingTimestamp = Date.now();

    response.on('finish', () => {
      if (!response.locals.errResp) {
        const { statusCode, message } = response.locals.loggingData;
        const processingTime = Date.now() - ingoingTimestamp;

        this.logger.log({
          statusCode,
          message,
          path: baseUrl,
          method,
          processingTime,
        });
      } else {
        this.logger.error(response.locals.errResp);
      }
    });

    next();
  }
}
