import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class ResponseMessageInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((result) => {
        //result is actualy contorller return value/object
        const response = context.switchToHttp().getResponse();

        const responseData = {
          statusCode: result.statusCode,
          message: result.message,
          ...(result.result !== null && { data: result.result }),
          //include property only if result is not null
        };

        const { data, ...rest } = responseData; // for logging we dont need data
        response.locals.loggingData = rest;
        return responseData;
      }),
    );
  }
}
