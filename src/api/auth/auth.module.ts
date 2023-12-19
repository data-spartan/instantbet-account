import { Module, MiddlewareConsumer, Logger } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthHelper } from './auth.helper';
import { AuthService } from './auth.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
// import { LoggerService } from 'src/logger/logger.service';
import { JwtRefreshGuard } from './guards/jwtRefreshAuth.guard';
import { JwtAuthGuard } from './guards/jwtAuth.guard';

import { RefreshToken } from '../users/index.entity';
import * as fs from 'fs';
import { RefreshPrivateSecretService } from './refreshKeysLoad.service';
import { MailModule } from 'src/mailer/mail.module';
import { VerifyEmailStrategy } from './strategies/verifyEmail.strategy';
import { UsersModule } from '../users/users.module';
import { ForgotPasswordStrategy } from './strategies/forgotPasswordToken.strategy';
import { readFileSync } from './helpers/readFile.helpers';
import { LoggerMiddleware } from 'src/middlewares/logging.middleware';
import { DatabaseModule } from 'src/database/database.module';
import { JwtStrategy } from './strategies/jwtStrategy.strategy';
import { JwtRefreshStrategy } from './strategies/jwtRefreshStrategy.strategy';

@Module({
  imports: [
    // The PassportModule.register({ … })is needed if you want to use
    // the AuthGuard contruct from passport with an implied
    // strategy(jwt,jwt-refresh...) across whole app

    PassportModule.register({ defaultStrategy: 'jwt', property: 'user' }),

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        privateKey: readFileSync(
          configService.get<string>('JWT_PRIVATE_SECRET_ACCESS'), //behind scenes JwtModule registers priv/pub key. its user fro signing and verifying tokens
        ).toString(),
        publicKey: readFileSync(
          configService.get<string>('JWT_PUBLIC_SECRET_ACCESS', 'utf-8'),
        ).toString(),
        signOptions: {
          expiresIn: configService.get<string>('APP_JWT_EXPIRES'),
          algorithm: 'ES256',
        },
      }),
    }),
    TypeOrmModule.forFeature([User, RefreshToken]),
    MailModule,
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [
    Logger,
    AuthService,
    AuthHelper,
    JwtStrategy,
    JwtRefreshStrategy,
    VerifyEmailStrategy,
    ForgotPasswordStrategy,
    RefreshPrivateSecretService,
  ],
  exports: [AuthService, AuthHelper, PassportModule],
  //export the PassportModule from AuthModule(its registered there).
  // The reason: in every module where you want to make use of AuthGuard(),
  // you will have have to import the AuthModule and register every time PassportModule.
  // but now only import AuthModule and you will have access to authguard
})
export class AuthModule {}
