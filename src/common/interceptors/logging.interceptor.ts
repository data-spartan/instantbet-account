import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { tap, map, finalize } from 'rxjs/operators';
import { GlobalResponseError } from '../exception-filters/errorResponse.formatter';
import { HttpAdapterHost } from '@nestjs/core';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: LoggerService) {}
  intercept(context: ExecutionContext, next) {
    const now = Date.now();
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const path = req.url;
    return next.handle().pipe(
      tap({
        next: () => {
          const res = context.switchToHttp().getResponse();
          const delay = Date.now() - now;
          console.log(res);
          this.logger.log('rest');
        },
        error: (error: Error) => {
          let message = 'Internal Server Error';
          let status = HttpStatus.INTERNAL_SERVER_ERROR;
          let stack = '';

          if (error instanceof HttpException) {
            message = error.message;
            status = error.getStatus();
            stack = status === 500 ? error.stack : '';
          }
          this.logger.error({ status, message, stack, method, path });
        },
      }),
    );
  }
}
