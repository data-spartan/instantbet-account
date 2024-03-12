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
import { ChangePasswordDto } from '../users/dto';
import { Response } from 'express';
import { JwtRefreshGuard } from './guards/jwtRefreshAuth.guard';
import { ForgotPasswordJwtAuthGuard } from './guards/forgotPasswordJwt.guard';
import { EmailConfirmationGuard } from './guards/emailConfirmation.guard';
import { VerifyEmailAuthGuard } from './guards/emailJwt.guard';
import { SignOutDto } from './dto/signOut.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { ResponseSuccess, UserContext } from '@app/common';

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
    res.cookie('auth-cookie', token.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: true,
    });
    return ResponseSuccess(`user ${id} loged in succesfully`, {
      access_token: token.accessToken,
    });
  }

  @UseGuards(EmailConfirmationGuard)
  @UseGuards(JwtAuthGuard)
  @Patch('/change-password')
  @HttpCode(200)
  private async changePassword(
    @Req() { user }: UserContext,
    @Body() body: ChangePasswordDto,
  ) {
    await this.authService.changePassword(body, user.id);
    return ResponseSuccess(`user ${user.id} changed password succesfully`);
  }

  @UseGuards(JwtRefreshGuard)
  @HttpCode(200)
  @Post('/sign-out')
  async signOut(@Req() { user }: SignOutDto) {
    const { userId, tokenId } = user;
    await this.authService.signOut(userId, tokenId);
    return ResponseSuccess(`user ${userId} signed-out succesfully`);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('/refresh')
  async refresh(
    @Req() { sub, access_token, refresh_token }: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.cookie(
      'auth-cookie',
      { refresh_token },
      { httpOnly: true, secure: true },
    );
    return ResponseSuccess(`user ${sub} refreshed tokens succesfully`, {
      access_token,
    });
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
  private async verifyForgotPassword(
    @Body() { newPassword }: ForgotPasswordDto,
    @Req() { user }: UserContext,
  ) {
    await this.authService.confirmForgotPassword(newPassword, user.id);
    return ResponseSuccess(
      `Succesfully confirmed forgot password action ${user.email}`,
    );
  }

  @UseGuards(VerifyEmailAuthGuard)
  // when user clicks on confirm email, request is sent to FE.
  // FE need to send token from URL, to this route. Guard decodes, verifies it ad updates confiremd email flag
  @Patch('verify-email')
  @HttpCode(200)
  async emailConfirmation(@Req() { user }: UserContext) {
    const result = await this.authService.confirmEmail(user.email, user.id);
    return ResponseSuccess(
      `user ${user.id} verified e-mail succesfully!`,
      result,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('resend-confirmation-link')
  @HttpCode(200)
  //from app user click on resend-confirmation-link button if email is expired or didnt arrived at all
  async resendConfirmationLink(@Req() { user }: UserContext) {
    await this.authService.resendVerificationEmail(user);
    return ResponseSuccess(
      `Resended mail confirmation link for user ${user.id}`,
    );
  }
}
