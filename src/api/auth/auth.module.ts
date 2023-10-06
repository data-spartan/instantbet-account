import { Module, MiddlewareConsumer } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthHelper } from './auth.helper';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { LoggerService } from 'src/common/logger/logger.service';
import { LoggerMiddleware } from 'src/common/middlewares/logging.middleware';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/auth.guard';
import { JwtRefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { RefreshToken } from '../users/index.entity';
import * as fs from 'fs';
import { RefreshPrivateSecretService } from './refreshKeysLoad.service';
import { MailModule } from 'src/mailer/mail.module';

@Module({
  imports: [
    // The PassportModule.register({ … })is needed if you want to use
    // the AuthGuard contruct from passport with an implied
    // strategy(jwt,jwt-refresh...) across whole app

    PassportModule.register({ defaultStrategy: 'jwt', property: 'user' }),
    // JwtModule.registerAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => ({
    //     secret: config.get('APP_JWT_KEY'),
    //     signOptions: { expiresIn: config.get('APP_JWT_EXPIRES') },
    //   }),
    // }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        privateKey: fs
          .readFileSync(
            configService.get<string>('JWT_PRIVATE_SECRET_ACCESS'),
            'utf-8',
          )
          .toString(),
        publicKey: fs
          .readFileSync(
            configService.get<string>('JWT_PUBLIC_SECRET_ACCESS', 'utf-8'),
          )
          .toString(),
        signOptions: {
          expiresIn: configService.get<string>('APP_JWT_EXPIRES'),
          algorithm: 'ES256',
        },
      }),
    }),
    TypeOrmModule.forFeature([User, RefreshToken]),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthHelper,
    AccessTokenStrategy,
    JwtRefreshTokenStrategy,
    RefreshPrivateSecretService,

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
