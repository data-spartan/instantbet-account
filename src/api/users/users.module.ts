import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { LoggerService } from 'src/common/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from './entities/token.entity';
import { LoggerMiddleware } from 'src/middlewares/logging.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User, RefreshToken]), AuthModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      inject: [ConfigService], // Inject the LoggerConfig dependency
      provide: LoggerService,
      useFactory: (configService: ConfigService) => {
        return new LoggerService('users', configService);
      },
    },
  ],
  exports: [UsersService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes(UsersController);
  }
}
