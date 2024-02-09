import { ISuccessResponse } from '../interfaces';

export const ResponseSuccess = (
  message: string = '',
  result: any = null,
  // statusCode: number = HttpStatus.OK,
): ISuccessResponse => {
  return {
    // statusCode,
    message,
    result,
  };
};
