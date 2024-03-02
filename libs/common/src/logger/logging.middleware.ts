import { Request, Response, NextFunction } from 'express';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
// import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class LoggerMiddlewareHttp implements NestMiddleware {
  constructor(private logger: Logger) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, baseUrl } = response.req;
    const ingoingTimestamp = Date.now();

    response.on('finish', () => {
      console.log(response);
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

@Injectable()
export class LoggerMiddlewareRpc implements NestMiddleware {
  constructor(private logger: Logger) {}

  use(request: Request, response: Response, next: NextFunction): void {
    console.log(response);
    const { method, baseUrl } = response.req;
    const ingoingTimestamp = Date.now();
    response.on('finish', () => {
      console.log(response);
      const { statusCode, message } = response.locals.loggingData;
      const processingTime = Date.now() - ingoingTimestamp;
      // console.log(statusCode);
      this.logger.log({
        statusCode,
        message,
        path: baseUrl,
        method,
        processingTime,
      });
    });

    next();
  }
}
