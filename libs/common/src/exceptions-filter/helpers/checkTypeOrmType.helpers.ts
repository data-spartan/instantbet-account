import { QueryFailedError } from 'typeorm';
import { HttpStatus } from '@nestjs/common';
import { IErrorTypeObject } from '@app/common/types/error.type';

export const checkTypeORMErrorType = (
  error: Error,
  // status: number,
  // message: string,
): IErrorTypeObject => {
  let status = HttpStatus.INTERNAL_SERVER_ERROR;
  let message;
  let stack;
  switch (error.name) {
    case QueryFailedError.name:
      if (error.message.includes('UQ_')) {
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        const extractedWord = error.message.match(/UQ_([^"]+)/)[1];
        message = `user with this ${extractedWord} already exists`;
      } else {
        message = error.message;
        stack = error.stack.split(':')[0];
      }
      break;

    // Add a default case to handle other types of errors
    default:
      message = error.message;
      stack = error.stack.split(':')[0];
      break;
  }

  return { status, message, stack };
};
