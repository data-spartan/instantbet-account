// custom-logger.module.ts
import { DynamicModule, Module, Scope } from '@nestjs/common';
// import { LoggerModule as NestLoggerModule } from '@nestjs/common';
import { LoggerConfig } from './logger.service';
import { WinstonModule } from 'nest-winston';
import { transports } from 'winston';
// import { WinstonModule } from 'nest-winston';\
import { LoggerService } from './logger.service';

@Module({
  //   providers: [LoggerService],
  //   exports: [LoggerService],
})
export class CustomLoggerModule {
  static forRoot(context: string): DynamicModule {
    console.log(context);
    return {
      module: CustomLoggerModule,
      providers: [
        {
          provide: LoggerService,
          scope: Scope.TRANSIENT,
          useFactory: () => {
            return new LoggerService(context);
          },
        },
      ],
      exports: [LoggerService],
    };
  }
}
