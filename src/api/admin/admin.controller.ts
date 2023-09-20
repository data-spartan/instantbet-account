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
  Post,
  Delete,
  UseFilters,
  Inject,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { UserRolesEnum } from '../users/roles/roles.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserDto } from '../users/dto/user.dto';
import { CreateTestUserDto } from './dto/createTestUser.dto';
import { CustomRequest } from 'src/common/interfaces';
import { AuthService } from '../auth/auth.service';
import { UserUpdateDto } from '../users/dto';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRolesEnum.Administrator)
@Serialize(UserDto)
// @UseInterceptors(LoggingInterceptor)
// @UseFilters(HttpExceptionFilter, AllExceptionsFilter)
export class AdminController {
  constructor(private readonly usersService: UsersService) {
    // this.logger.setContext('NUTRA');
  }

  @Get('/users')
  public async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('/users/:id')
  public async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post('/users')
  public async createTestUser(@Body() body: CreateTestUserDto) {
    return this.usersService.createTestUser(body);
  }

  @Delete('/users/:id')
  public async removeUser(@Param('id') id: string) {
    await this.usersService.remove(id);
  }

  // @Get('/me')
  // private async me(@Req() { user }: CustomRequest): Promise<User | never> {
  //   return this.authService.me(user);
  // }

  @Patch('/me/update-profile')
  async updateAdminProfile(
    @Req() { user }: CustomRequest,
    @Body() body: UserUpdateDto,
  ) {
    return this.usersService.updateMyProfile(user.id, body);
  }
}
