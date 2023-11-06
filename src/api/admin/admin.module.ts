import { Module, UseFilters, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/entities/user.entity';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
// import { LoggerService } from 'src/logger/logger.service';

import { ConfigService } from '@nestjs/config';
import { LoggerConfig } from 'src/logger/logger.config';
import { LoggerMiddleware } from 'src/middlewares/logging.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule, UsersModule],
  controllers: [AdminController],
  providers: [
    // {
    //   inject: [ConfigService], // Inject the LoggerConfig dependency
    //   provide: LoggerService,
    //   useFactory: (configService: ConfigService) => {
    //     return new LoggerService('admin', configService);
    //   },
    // },
  ],
})
export class AdminModule {
  // configure(consumer: MiddlewareConsumer): void {
  //   consumer.apply(LoggerMiddleware).forRoutes(AdminController);
  // }
}
