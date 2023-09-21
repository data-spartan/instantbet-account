import {
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Body,
  Req,
  UseFilters,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UserRolesEnum } from './roles/roles.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { UserUpdateDto } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';
import { CustomRequest } from 'src/common/interfaces';
import {
  HttpExceptionFilter,
  TypeORMExceptionFilter,
} from 'src/common/exception-filters';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRolesEnum.Basic, UserRolesEnum.Test)
@Serialize(UserDto)
// @UseInterceptors(LoggingInterceptor)
// @UseFilters(HttpExceptionFilter, TypeORMExceptionFilter)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  // @Get()
  // @Roles(UserRolesEnum.Administrator)
  // public async findAll(): Promise<User[]> {
  //   return this.usersService.findAll();
  // }

  // @Get('/:id')
  // public async findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(id);
  // }

  // @Get('/me')
  // private async me(@Req() { user }: CustomRequest): Promise<User | never> {
  //   return await this.authService.me(user);
  // }

  @Patch('/me/update-profile')
  async updateMyProfile(
    @Req() { user }: CustomRequest,
    @Body() body: UserUpdateDto,
  ) {
    return this.usersService.updateMyProfile(user.id, body);
  }
}
