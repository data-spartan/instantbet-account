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
import { AuthService } from '../auth/auth.service';
import { CustomRequest } from 'src/common/types';

// @UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRolesEnum.Basic)
@Serialize(UserDto)
@Controller('users')
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

  // @Patch('/:id')
  // async updateMyProfile(@Param('id') id: string, @Body() body: UserUpdateDto) {
  //   return this.usersService.updateMyProfile(id, body);
  // }

  @Get('/me')
  private me(@Req() { user }: CustomRequest): Promise<User | never> {
    return this.authService.me(user);
  }

  @Patch('/update-profile')
  async updateMyProfile(
    @Req() { user }: CustomRequest,
    @Body() body: UserUpdateDto,
  ) {
    return this.usersService.updateProfile(user.id, body);
  }

  // @Patch('/:id')
  // async updateMyProfile(@Param('id') id: string, @Body() body: UserUpdateDto) {
  //   return this.usersService.updateMyProfile(id, body);
  // }
}
