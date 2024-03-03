import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

import { TypeORMError } from 'typeorm';
import { GlobalResponseError, checkTypeORMErrorType } from '@app/common';

@Catch(TypeORMError)
export class TypeORMExceptionFilter implements ExceptionFilter {
  // constructor(private readonly logger: LoggerService) {}

  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

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
    //bcs middlewares are executed jsut before the actual response is sent back to the client ,
    //  middleware cant directly access response body e.g.
    //  ...json(errRespBody), so need to assign it explictily to response.locals to be
    //availbe in logging middleware

    response.status(status).json(errRespBody);
  }
}
