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
import { TypeORMExceptionFilter } from 'src/common/exception-filters';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { ResponseSuccess } from 'src/common/helpers';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRolesEnum.Basic, UserRolesEnum.Test)
// @Serialize(UserDto)
// @UseInterceptors(LoggingInterceptor)
// @UseFilters(HttpExceptionFilter, TypeORMExceptionFilter)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Patch('/me/update-profile')
  async updateMyProfile(
    @Req() { user }: CustomRequest,
    @Body() body: UserUpdateDto,
  ) {
    const result = await this.usersService.updateMyProfile(user.id, body);
    return ResponseSuccess(
      `user ${result.id} updated ${result.props} succesfully`,
    );
  }
}
