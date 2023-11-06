import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  Patch,
  HttpStatus,
} from '@nestjs/common';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordEmailDto,
  ForgotPasswordDto,
} from './dto';
import { JwtAuthGuard } from './guards/auth.guard';
import { AuthService } from './auth.service';
import { CustomRequest } from 'src/common/interfaces';
import { ChangePasswordDto } from '../users/dto';
import { Request, Response } from 'express';
import { JwtRefreshGuard } from './guards/jwtRefresh.guard';
import { EmailJwtAuthGuard } from './guards/emailJwt.guard';
import { ForgotPasswordJwtAuthGuard } from './guards/forgotPasswordJwt.guard';
import { EmailConfirmationGuard } from './guards/emailConfirmation.guard';
import { ResponseSuccess } from 'src/common/response-formatter';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  // @UseInterceptors(ClassSerializerInterceptor)
  private async register(@Body() body: RegisterDto, @Req() req: Request) {
    const { id } = await this.authService.register(body);
    // req.res.setHeader('Token-Id', token.tokenId);
    return ResponseSuccess(
      `Verification e-mail is sent to user ${id}`,
      null,
      HttpStatus.CREATED,
    );
  }

  @Post('/login')
  private async login(@Body() body: LoginDto, @Req() req: Request) {
    const { token, id } = await this.authService.login(body);
    req.res.setHeader('Token-Id', token.tokenId);
    return ResponseSuccess(`user ${id} loged in succesfully`, token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  private async me(@Req() { user }: CustomRequest) {
    return ResponseSuccess(
      `user ${user.id} profile retrieved succesfully`,
      user,
    );
  }
  @UseGuards(EmailConfirmationGuard)
  @UseGuards(JwtAuthGuard)
  @Patch('/change-password')
  private async changePassword(
    @Req() { user }: CustomRequest,
    @Body() body: ChangePasswordDto,
  ) {
    await this.authService.changePassword(body, user.id);
    return ResponseSuccess(`user ${user.id} changed password succesfully`);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/sign-out')
  async signOut(@Req() request: CustomRequest) {
    const tokenId = request.header('Token-Id');
    await this.authService.signOut(tokenId); //invalidate current refresh token
    return ResponseSuccess(`user ${request.user.id} succesfully`);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('/refresh')
  async refresh(@Req() { user }: CustomRequest) {
    const result = user;
    return ResponseSuccess(`token refreshed succesfully`, result);
  }

  @Post('/forgot-password')
  private async forgotPassword(@Body() body: ForgotPasswordEmailDto) {
    await this.authService.forgotPassword(body);
    return ResponseSuccess(`Forgot password mail link sent to ${body.email}`);
  }

  @Patch('/confirm-forgot-password')
  @UseGuards(ForgotPasswordJwtAuthGuard)
  private verifyForgotPassword(
    @Body() { newPassword }: ForgotPasswordDto,
    @Req() { user }: CustomRequest,
  ) {
    this.authService.forgotChangePassword(newPassword, user.id);
    return ResponseSuccess(
      `Succesfully confirmed forgot password action ${user.email}`,
    );
  }

  @UseGuards(EmailJwtAuthGuard)
  //when user clicks on confirm email, request is sent to FE.
  // FE need to send token from URL, to this route. Guard decodes, verifies it ad updates confiremd email flag
  @Post('verify-email')
  async emailConfirmation(@Req() { user }: CustomRequest) {
    return ResponseSuccess(`user ${user.id} verified e-mail succesfully!`);
  }

  @UseGuards(JwtAuthGuard)
  @Post('resend-confirmation-link')
  async resendConfirmationLink(@Req() { user }: CustomRequest) {
    await this.authService.resendVerificationEmail(user);
    return ResponseSuccess(
      `Resended mail confirmation link for user ${user.id}`,
    );
  }
}
