import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): {}; // any class you pass as dto will be valid, this is basic.
}

// CREAETING WRAPPER DECORATOR IN ORDER FOR DECORATOR TO BE SHORTER
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(
    context: ExecutionContext,
    handler: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    // run something before request is handled by req handler
    // console.log('in interceptor before returning response');
    return handler.handle().pipe(
      //handler object represents the controller's method that is being intercepted.
      map((data: any) => {
        console.log('in interceptor when returning resp');
        // run something before resp is sent
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
          //   enableImplicitConversion: true,
        });
      }),
    );
  }
}
