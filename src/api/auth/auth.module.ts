import { Module, MiddlewareConsumer } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthHelper } from './auth.helper';
import { AuthService } from './auth.service';
import { JwtStrategy } from './auth.strategy';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { LoggerService } from 'src/common/logger/logger.service';
import { LoggerMiddleware } from 'src/common/middlewares/logging.middleware';

@Module({
  imports: [
    // The PassportModule.register({ … })only needed if you want to use
    // the AuthGuard syntax with an implied default strategy: @UseGuards(AuthGuard)

    PassportModule.register({ defaultStrategy: 'jwt', property: 'user' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('APP_JWT_KEY'),
        signOptions: { expiresIn: config.get('APP_JWT_EXPIRES') },
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthHelper,
    JwtStrategy,

    {
      inject: [ConfigService], // Inject the LoggerConfig dependency
      provide: LoggerService,
      useFactory: (configService: ConfigService) => {
        return new LoggerService('auth', configService);
      },
    },
  ],
  exports: [AuthService, AuthHelper, PassportModule],
  //export the PassportModule from AuthModule(its registered there).
  // The reason: in every module where you want to make use of AuthGuard(),
  // you will have have to import the AuthModule and register every time PassportModule.
  // but now only import AuthModule and you will have access to authguard
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes(AuthController);
  }
}
