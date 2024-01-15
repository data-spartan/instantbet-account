import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { tap, map, finalize } from 'rxjs/operators';
import { HttpAdapterHost } from '@nestjs/core';
// import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: Logger) {}
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
