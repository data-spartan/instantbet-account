import { ISuccessResponse } from '../types/successResponse.type';

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
