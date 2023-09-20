import { QueryFailedError } from 'typeorm';
import { HttpStatus } from '@nestjs/common';
import { IErrorTypeObject } from 'src/common/interfaces';

export const checkTypeORMErrorType = (
  error: Error,
  // status: number,
  // message: string,
): IErrorTypeObject => {
  let status = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Internal Server Error';
  let stack = '';
  switch (error.name) {
    case QueryFailedError.name:
      if (error.message.includes('UQ_')) {
        //checks if error is related with unique constraint conflict
        //e.g. one user wants to change phone property(which is unique) but that new phone num
        // some other user already has, db throws an error
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        const extractedWord = error.message.match(/UQ_([^"]+)/)[1];
        message = `user with this ${extractedWord} already exists`;
        // return { status, message };
      } else {
        stack = error.stack;
        //assign stack only if error is not catched, bcs we need it to determine whats wrong
      }
      break;
  }
  return { status, message, stack };
};
