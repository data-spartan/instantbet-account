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
import { Request } from 'express';

// @UseInterceptors(ClassSerializerInterceptor)
@Serialize(UserDto)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRolesEnum.Administrator)
  public async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('/:id')
  public async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // @Patch('/:id')
  // async updateMyProfile(@Param('id') id: string, @Body() body: UserUpdateDto) {
  //   return this.usersService.updateMyProfile(id, body);
  // }

  @Patch()
  async updateMyProfile(@Req() { user }: Request, @Body() body: UserUpdateDto) {
    return this.usersService.updateMyProfile(<User>user, body);
  }
}
