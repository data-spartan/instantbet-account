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
import { HttpExceptionFilter } from 'src/common/exception-filters/';

@Controller('auth')
@Serialize(AuthRespDto)
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  // @UseInterceptors(ClassSerializerInterceptor)
  private register(@Body() body: RegisterDto): Promise<AuthedResponse> | never {
    return this.authService.register(body);
  }

  @Post('/login')
  private login(@Body() body: LoginDto): Promise<AuthedResponse | never> {
    return this.authService.login(body);
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  private async me(@Req() { user }: CustomRequest): Promise<User | never> {
    return this.authService.me(user.id);
  }

  @Patch('/change-password')
  @UseGuards(JwtAuthGuard)
  private changePassword(
    @Req() { user }: CustomRequest,
    @Body() body: ChangePasswordDto,
  ) {
    return this.authService.changePassword(body, user.id);
  }

  // @Get('/me')
  // @UseGuards(JwtAuthGuard)
  // private me(@Req() { user }: CustomRequest): Promise<User | never> {
  //   return this.authService.me(user);
  // }
}
