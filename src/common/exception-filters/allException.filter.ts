import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { GlobalResponseError } from '../exceptions/errorResponse.formatter';
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let message = 'Internal Server Error';
    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      message = exception.message;
      httpStatus = exception.getStatus();
    }

    const responseBody = GlobalResponseError(
      httpStatus,
      message,
      httpAdapter.getRequestUrl(ctx.getRequest()),
      httpAdapter.getRequestMethod(ctx.getRequest()),
    );
    // const responseBody = {
    //   statusCode: httpStatus,
    //   message,
    //   timestamp: new Date().toISOString(),
    //   path: httpAdapter.getRequestUrl(ctx.getRequest()),
    //   method: httpAdapter.getRequestMethod(ctx.getRequest()),
    // };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
