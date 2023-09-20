import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GlobalResponseError } from './errorResponse.formatter';
import { TypeORMError, QueryFailedError } from 'typeorm';
import { LoggerService } from '../logger/logger.service';
import { checkTypeORMErrorType } from './helpers';
@Catch(TypeORMError)
export class TypeORMExceptionFilter implements ExceptionFilter {
  // constructor(private readonly logger: LoggerService) {}

  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    // let status = HttpStatus.INTERNAL_SERVER_ERROR;
    // let message = 'Internal Server Error';

    const path = request.path;
    const method = request.method;

    const { status, message, stack } = checkTypeORMErrorType(exception);

    const errRespBody = GlobalResponseError(
      status,
      message,
      path,
      method,
      stack,
    );

    response.locals.errResp = errRespBody;
    //bcs of the way exceptio filter works, middleware() cant use ...json(errRespBody), so logging.middleware doeesnt
    // cant capture this errRespBody, so need to assign it explictily to response.locale to be
    //availbe in logging middleware

    response.status(status).json(errRespBody);
  }
}
