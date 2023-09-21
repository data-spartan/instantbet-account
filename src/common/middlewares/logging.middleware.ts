import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private logger: LoggerService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, path } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      if (!response.locals.errResp) {
        this.logger.log({ method, path });
      } else {
        this.logger.error(response.locals.errResp);
      }
    });

    next();
  }
}
