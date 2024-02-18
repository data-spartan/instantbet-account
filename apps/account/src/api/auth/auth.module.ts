import { Module, Logger } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthHelper } from './auth.helper';
import { AuthService } from './auth.service';

import { ConfigService } from '@nestjs/config';
import { RefreshPrivateSecretService } from './refreshKeysLoad.service';
import { VerifyEmailStrategy } from './strategies/verifyEmail.strategy';
import { ForgotPasswordStrategy } from './strategies/forgotPasswordToken.strategy';
import { readFileSync } from './helpers/readFile.helpers';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwtRefresh.strategy';
import { MailModule } from '@account/mailer/mail.module';
import { DatabaseModule } from '@account/database/database.module';
import { RedisCacheModule, RefreshToken, User } from '@app/common';

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
    RedisCacheModule,
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
