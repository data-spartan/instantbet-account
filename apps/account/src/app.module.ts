import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from './api/api.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import {
  AllExceptionsFilter,
  TypeORMExceptionFilter,
} from './exception-filters';
import { ResponseMessageInterceptor } from './interceptors/responseMessage.interceptor';
import { TypeOrmConfigService } from './config/typeorm/typeorm.service';
import { LoggerMiddleware } from './middlewares/logging.middleware';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppService } from './app.service';
import {
  DirectoryCreationService,
  RmqModule,
  ServeStaticConfigService,
} from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      /*
      using this.config.get can read proces.env.VAR or .env file if specified
      dockerized app doesnt read direclty from .env. We pass .env content in docker-compose file
       and config.get is reading var as proces.env behind the scenes
       */
      ignoreEnvFile: process.env.NODE_ENV === 'production' ? true : false,
      envFilePath: '.env',
    }),
    //If we need to get the localy uploaded users media
    //the server detects the file as a route, thats why we need ServeStatic
    ServeStaticModule.forRootAsync({
      useClass: ServeStaticConfigService,
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    ApiModule,
    RmqModule.register({
      //registering producer
      name: 'EMAIL',
    }),
  ],
  controllers: [AppController],
  providers: [
    Logger,
    DirectoryCreationService,
    //using this construct if want you can inject filters wherever you want
    // using  app.useGlobalFilters you cant inject
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
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
  constructor(private configService: ConfigService) {}
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
  // async onModuleInit(): Promise<void> {
  //   Logger.log('✅ App Users Module initialized!');
  //   const typeOrmConfig = getConfigServiceTypeOrmConfig(this.configService);
  //   const dataSource = new DataSource({
  //     ...typeOrmConfig,
  //   });
  //   const connection = await dataSource.initialize();
  //   const database = typeOrmConfig.database;
  //   try {
  //     console.log(database);
  //     const databaseExists = await connection.query(
  //       `SELECT FROM pg_database WHERE datname = '${database}'`,
  //     );
  //     if (databaseExists.rowCount === 0) {
  //       await connection.query(`CREATE DATABASE ${database}`);
  //       Logger.log(`✅ Database ${database} created! `);
  //     } else {
  //       Logger.log(`✅ Database ${database} already exists! `);
  //     }
  //   } catch (e) {
  //     Logger.error(`🚩 Create database ${database} failed: ${e.message}`);
  //   } finally {
  //     await connection.destroy();
  //   }
  // }
}
