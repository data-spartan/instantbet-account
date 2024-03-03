import { IErrorTypeObject } from '@app/common/types/error.type';
import { HttpException, HttpStatus } from '@nestjs/common';

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
    message = error['response']['message'] || error.message;
    //using ['response']['message'] bcs validation error msgs cant be accessed otherwise with error.message
    status = error.getStatus();
  } else {
    //assign stack only if error is not catched, bcs we need it to determine whats wrong
    stack = error.stack;
  }

  return { status, message, stack };
};
