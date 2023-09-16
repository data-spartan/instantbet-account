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
import { LoggerService } from '../logger/logger.service';

@Catch(TypeORMError)
export class TypeORMExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';

    const path = request.path;
    const method = request.method;

    switch (exception.name) {
      case QueryFailedError.name:
        if (exception.message.includes('UQ_')) {
          //checks if error is related with unique constraint conflict
          //e.g. one user wants to change phone property(which is unique) but that new phone num
          // some other user already has, db throws an error
          status = HttpStatus.UNPROCESSABLE_ENTITY;
          const extractedWord = exception.message.match(/UQ_([^"]+)/)[1];
          message = `user with this ${extractedWord} already exists`;
        } else {
        }
        break;
    }

    this.logger.error({
      status,
      message,
      path,
      method,
    });
    response
      .status(status)
      .json(GlobalResponseError(status, message, path, method));
  }
}
