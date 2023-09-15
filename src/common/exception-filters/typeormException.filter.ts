import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GlobalResponseError } from '../exceptions/errorResponse.formatter';
import { TypeORMError, QueryFailedError } from 'typeorm';

@Catch(TypeORMError)
export class TypeORMExceptionFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = 500;
    let message = 'Internal Server Error';

    switch (exception.name) {
      case QueryFailedError.name:
        if (exception.message.includes('UQ_')) {
          status = HttpStatus.UNPROCESSABLE_ENTITY;
          const extractedWord = exception.message.match(/UQ_([^"]+)/)[1];
          message = `user with this ${extractedWord} already exists`;
        } else {
        }
        break;
    }

    response
      .status(status)
      .json(GlobalResponseError(status, message, request.path, request.method));
  }
}
