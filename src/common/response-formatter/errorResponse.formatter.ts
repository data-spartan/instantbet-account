import { IErrorResponse } from '../interfaces';

export const GlobalResponseError = (
  statusCode: number,
  message: string,
  path: string,
  method: string,
  stack: string | void,
): IErrorResponse => {
  return {
    statusCode,
    message,
    path,
    method,
    stack,
  };
};
