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
  HttpStatus,
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
import { ResponseSuccess } from 'src/common/helpers';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRolesEnum.Administrator)
// @Serialize(UserDto)
// @UseInterceptors(LoggingInterceptor)
// @UseFilters(HttpExceptionFilter, AllExceptionsFilter)
export class AdminController {
  constructor(private readonly usersService: UsersService) {
    // this.logger.setContext('NUTRA');
  }

  @Get('/users')
  public async findAll() {
    const result = await this.usersService.findAll();
    return ResponseSuccess(`users retrieved succesfully`, result);
  }

  @Get('/users/:id')
  public async findOne(@Param('id') id: string) {
    const result = await this.usersService.findOne(id);
    return ResponseSuccess(`users retrieved succesfully`, result);
  }

  @Post('/users')
  public async createTestUser(@Body() body: CreateTestUserDto) {
    const result = await this.usersService.createTestUser(body);
    return ResponseSuccess(
      `test user created succesfully`,
      result,
      HttpStatus.CREATED,
    );
  }

  @Delete('/users/:id')
  public async removeUser(@Param('id') id: string) {
    await this.usersService.remove(id);
    return ResponseSuccess(`user deleted succesfully`);
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
    const result = await this.usersService.updateMyProfile(user.id, body);
    // return ResponseSuccess(
    //   `${Object.keys(body).join(',')} updated succesfully`,
    // );

    return ResponseSuccess(
      `user ${result.id} updated ${result.props} succesfully`,
    );
  }
}
