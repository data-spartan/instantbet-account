import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { GlobalResponseError } from '../exceptions/errorResponse.formatter';
import { LoggerService } from '../logger/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: LoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let message = 'Internal Server Error';
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    const path = httpAdapter.getRequestUrl(ctx.getRequest());
    const method = httpAdapter.getRequestMethod(ctx.getRequest());

    if (exception instanceof HttpException) {
      message = exception.message;
      status = exception.getStatus();
    }
    this.logger.error({
      status,
      message,
      path,
      method,
    });
    const responseBody = GlobalResponseError(status, message, path, method);
    // const responseBody = {
    //   statusCode: httpStatus,
    //   message,
    //   timestamp: new Date().toISOString(),
    //   path: httpAdapter.getRequestUrl(ctx.getRequest()),
    //   method: httpAdapter.getRequestMethod(ctx.getRequest()),
    // };

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}
