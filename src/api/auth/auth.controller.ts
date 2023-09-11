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
} from '@nestjs/common';
import { RegisterDto, LoginDto } from './dto';
import { JwtAuthGuard } from './guards/auth.guard';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { AuthedResponse } from './interfaces/auth.interface';
import { Request } from 'express';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { AuthRespDto } from './dto/auth-resp.dto';

@Controller('auth')
@Serialize(AuthRespDto)
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/register')
  // @UseInterceptors(ClassSerializerInterceptor)
  private register(@Body() body: RegisterDto): Promise<AuthedResponse> | never {
    return this.service.register(body);
  }

  @Post('/login')
  private login(@Body() body: LoginDto): Promise<AuthedResponse | never> {
    return this.service.login(body);
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  private me(@Req() { user }: Request): Promise<User | never> {
    return this.service.me(<User>user);
  }
}
