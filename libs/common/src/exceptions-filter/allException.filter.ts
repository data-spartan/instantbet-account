import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import {
  GlobalResponseError,
  IErrorResponse,
  checkErrorType,
} from '@app/common';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost, // private readonly logger: LoggerService,
  ) {}

  catch(exception: Error, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const path = httpAdapter.getRequestUrl(ctx.getRequest());
    const method = httpAdapter.getRequestMethod(ctx.getRequest());
    const { status, message, stack } = checkErrorType(exception);
    const errRespBody = GlobalResponseError(
      status,
      message,
      path,
      method,
      stack,
    );
    const response = ctx.getResponse();
    response.locals.errResp = errRespBody;
    httpAdapter.reply(response, errRespBody, status);
  }
}

Catch(RpcException);
export class ExceptionFilterRpc implements ExceptionFilter {
  private readonly logger = new Logger();

  catch(exception: RpcException, host: ArgumentsHost) {
    if (typeof exception?.getError === 'function') {
      const { message, path, stack, statusCode } =
        exception?.getError() as IErrorResponse;
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const status = statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      response.status(status).json({
        statusCode: status,
        message: exception.message,
        path,
      });
      this.logger.error(
        JSON.stringify({
          message,
          status,
          path,
          stack: stack || '',
        }),
      );
    } else {
      this.logger.error(
        JSON.stringify({
          message: exception.message,
          status: exception['status'],
          path: exception['path'] || '',
          stack:
            exception['status'] === HttpStatus.INTERNAL_SERVER_ERROR
              ? exception['stack']
              : '',
        }),
      );
    }
    return throwError(() => new RpcException(exception));
  }
}
