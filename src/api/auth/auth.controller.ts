import {
  Body,
  Controller,
  Inject,
  Post,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
  Req,
  Get,
  Patch,
  UseFilters,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { RegisterDto, LoginDto } from './dto';
import { JwtAuthGuard } from './guards/auth.guard';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { AuthedResponse } from './interfaces/auth.interface';
import { CustomRequest } from 'src/common/interfaces';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { AuthRespDto } from './dto/authResp.dto';
import { ChangePasswordDto } from '../users/dto';
import { LoggerService } from 'src/common/logger/logger.service';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { Request, Response } from 'express';
import { ResponseSuccess } from 'src/common/helpers/successResponse.formater';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { use } from 'passport';
import { ConfirmEmailDto } from 'src/mailer/dto/confirmEmail.dto';
import { EmailJwtAuthGuard } from './guards/emailJwt.guard';
import { UsersService } from '../users/users.service';

@Controller('auth')
// @Serialize(AuthRespDto)
// @UseInterceptors(LoggingInterceptor)
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
    console.log(user);
    const result = await this.authService.me(user.id);
    return ResponseSuccess(
      `user ${result.id} profile retrieved succesfully`,
      result,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/change-password')
  private async changePassword(
    @Req() { user }: CustomRequest,
    @Body() body: ChangePasswordDto,
  ) {
    const result = await this.authService.changePassword(body, user.id);
    return ResponseSuccess(
      `user ${user.id} changed password succesfully`,
      result,
    );
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
    return ResponseSuccess(`Resended confirmation link for user ${user.id}`);
  }
}
