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
import { Response } from 'express';
import { ResponseSuccess } from 'src/common/helpers/successResponse.formater';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { use } from 'passport';

@Controller('auth')
// @Serialize(AuthRespDto)
// @UseInterceptors(LoggingInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  // @UseInterceptors(ClassSerializerInterceptor)
  private async register(@Body() body: RegisterDto) {
    const { token, id } = await this.authService.register(body);
    return ResponseSuccess(
      `user ${id} registered succesfully`,
      token,
      HttpStatus.CREATED,
    );
  }

  @Post('/login')
  private async login(@Body() body: LoginDto) {
    const { token, id } = await this.authService.login(body);
    return ResponseSuccess(`user ${id} loged in succesfully`, token);
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  private async me(@Req() { user }: CustomRequest) {
    const result = await this.authService.me(user.id);
    return ResponseSuccess(
      `user ${result.id} profile retrieved succesfully`,
      result,
    );
  }

  @Patch('/change-password')
  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtRefreshGuard)
  @Get('/refresh')
  async refresh(@Req() { user }: CustomRequest) {
    //request.res.setHeader('Set-Cookie', accessToken); next-auth creates cookie no need here
    const result = user;
    console.log(user);
    return ResponseSuccess(`token refreshed succesfully`, result);
  }
}
