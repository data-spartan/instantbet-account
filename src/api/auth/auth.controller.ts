import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  Patch,
  Res,
  HttpCode,
} from '@nestjs/common';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordEmailDto,
  ForgotPasswordDto,
} from './dto';
import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { AuthService } from './auth.service';
import { CustomRequest } from 'src/common/interfaces';
import { ChangePasswordDto } from '../users/dto';
import { Response } from 'express';
import { JwtRefreshGuard } from './guards/jwtRefreshAuth.guard';
import { ForgotPasswordJwtAuthGuard } from './guards/forgotPasswordJwt.guard';
import { EmailConfirmationGuard } from './guards/emailConfirmation.guard';
import { ResponseSuccess } from 'src/common/response-formatter';
import { VerifyEmailAuthGuard } from './guards/emailJwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  private async register(@Body() body: RegisterDto) {
    const userId = await this.authService.register(body);
    return ResponseSuccess(
      `user ${userId} has been registered successfully.`,
      null,
    );
  }

  @Post('/login')
  @HttpCode(200)
  private async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, id } = await this.authService.login(body);
    res.cookie('auth-cookie', token, { httpOnly: true, secure: false });
    return ResponseSuccess(`user ${id} loged in succesfully`);
  }

  @UseGuards(EmailConfirmationGuard)
  @UseGuards(JwtAuthGuard)
  @Patch('/change-password')
  @HttpCode(200)
  private async changePassword(
    @Req() { user }: CustomRequest,
    @Body() body: ChangePasswordDto,
  ) {
    await this.authService.changePassword(body, user.id);
    return ResponseSuccess(`user ${user.id} changed password succesfully`);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('/sign-out')
  async signOut(@Req() { user }: CustomRequest) {
    await this.authService.signOut(user.id);
    return ResponseSuccess(`user ${user.id} signed-out succesfully`);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('/refresh')
  async refresh(
    @Req() { user }: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, sub } = user;
    res.cookie(
      'auth-cookie',
      { accessToken, refreshToken },
      { httpOnly: true, secure: false },
    );
    return ResponseSuccess(`user ${sub} refreshed tokens succesfully`);
  }

  @Post('/forgot-password')
  @HttpCode(200)
  private async forgotPassword(@Body() body: ForgotPasswordEmailDto) {
    await this.authService.forgotPassword(body);
    return ResponseSuccess(`Forgot password mail link sent to ${body.email}`);
  }

  @UseGuards(ForgotPasswordJwtAuthGuard)
  @Patch('/confirm-forgot-password')
  @HttpCode(200)
  private verifyForgotPassword(
    @Body() { newPassword }: ForgotPasswordDto,
    @Req() { user }: CustomRequest,
  ) {
    this.authService.confirmForgotPassword(newPassword, user.id);
    return ResponseSuccess(
      `Succesfully confirmed forgot password action ${user.email}`,
    );
  }

  @UseGuards(VerifyEmailAuthGuard)
  // when user clicks on confirm email, request is sent to FE.
  // FE need to send token from URL, to this route. Guard decodes, verifies it ad updates confiremd email flag
  @Patch('verify-email')
  @HttpCode(200)
  async emailConfirmation(@Req() { user }: CustomRequest) {
    return ResponseSuccess(`user ${user.id} verified e-mail succesfully!`);
  }

  @UseGuards(JwtAuthGuard)
  @Post('resend-confirmation-link')
  @HttpCode(200)
  //from app user click on resend-confirmation-link button if email is expired or didnt arrived at all
  async resendConfirmationLink(@Req() { user }: CustomRequest) {
    await this.authService.resendVerificationEmail(user);
    return ResponseSuccess(
      `Resended mail confirmation link for user ${user.id}`,
    );
  }
}
