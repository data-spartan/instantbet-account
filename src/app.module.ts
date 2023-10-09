import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from './api/api.module';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import {
  AllExceptionsFilter,
  TypeORMExceptionFilter,
} from './common/exception-filters';
import { ResponseMessageInterceptor } from './common/interceptors/responseMessage.interceptor';
import { DirectoryCreationService } from './shared/dirCreation/dirCreation';
import { LoggerService } from './common/logger/logger.service';
import { LoggerMiddleware } from './common/middlewares/logging.middleware';
import { DataSource } from 'typeorm';

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
    {
      inject: [ConfigService],
      provide: LoggerService,
      useFactory: (configService: ConfigService) => {
        return new LoggerService('sys', configService);
      },
    },
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
    // {
    //   provide: APP_FILTER,
    //   useClass: AllExceptionsFilter,
    // },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
