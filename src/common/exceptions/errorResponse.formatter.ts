import { IErrorResponse } from '../interfaces';
import { Request, Response } from 'express';

export const GlobalResponseError: (
  statusCode: number,
  message: string,
  path: string,
  method: string,
) => IErrorResponse = (
  statusCode: number,
  message: string,
  path: string,
  method: string,
): IErrorResponse => {
  return {
    statusCode: statusCode,
    message,
    timestamp: new Date().toISOString(),
    path,
    method,
  };
};
