import { HttpException, HttpStatus } from '@nestjs/common';
import { IErrorTypeObject } from 'src/common/interfaces';

export const checkErrorType = (
  error: Error,
  //   status: number,
  //   message: string,
  //   stack: string,
): IErrorTypeObject => {
  let message = 'Internal Server Error';
  let status = HttpStatus.INTERNAL_SERVER_ERROR;
  let stack = '';

  if (error instanceof HttpException) {
    message = error.message;
    status = error.getStatus();
  } else {
    //assign stack only if error is not catched, bcs we need it to determine whats wrong
    stack = error.stack;
  }

  return { status, message, stack };
};
