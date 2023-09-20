import { IErrorResponse } from '../interfaces';
import { Request, Response } from 'express';

export const GlobalResponseError: (
  statusCode: number,
  message: string,
  path: string,
  method: string,
  stack: string | void,
) => IErrorResponse = (
  statusCode: number,
  message: string,
  path: string,
  method: string,
  stack: string | void,
): IErrorResponse => {
  return {
    statusCode,
    message,
    // timestamp: new Date().toISOString(),
    path,
    method,
    stack,
  };
};
