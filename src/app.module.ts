import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from './api/api.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import {
  AllExceptionsFilter,
  TypeORMExceptionFilter,
} from './exception-filters';
import { DirectoryCreationService } from './shared/dirCreation/dirCreation';
import { LoggerService } from './logger/logger.service';
import { DataSource } from 'typeorm';
import { ResponseMessageInterceptor } from './interceptors/responseMessage.interceptor';
import { TypeOrmConfigService } from './config/typeorm/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    ApiModule,
  ],
  controllers: [AppController],
  providers: [
    Logger,
    // {
    //   inject: [ConfigService],
    //   provide: LoggerService,
    //   useFactory: (configService: ConfigService) => {
    //     return new LoggerService('sys', configService);
    //   },
    // },
    DirectoryCreationService,
    //using this construct if want you can inject filters wherever you want
    // using  app.useGlobalFilters you cant inject
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
    {
      provide: APP_FILTER,
      useClass: TypeORMExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseMessageInterceptor,
    },
    AppService,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
