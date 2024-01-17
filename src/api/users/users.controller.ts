import {
  Controller,
  Get,
  Patch,
  UseGuards,
  Body,
  Req,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRolesEnum } from './roles/roles.enum';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import { UserUpdateDto } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';
import { CustomRequest } from 'src/common/interfaces';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ResponseSuccess } from 'src/common/response-formatter';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) // EmailConfirmationGuard)
@Roles(UserRolesEnum.Basic, UserRolesEnum.Test)
// @Serialize(UserDto)
// @UseInterceptors(LoggingInterceptor)
// @UseFilters(HttpExceptionFilter, TypeORMExceptionFilter)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get('/me')
  private async me(@Req() { user }: CustomRequest) {
    const result = await this.usersService.findOne(user.id);
    return ResponseSuccess(`Retrieved user ${user.id} profile.`, result);
  }

  @Patch('/me')
  async update(@Req() { user }: CustomRequest, @Body() body: UserUpdateDto) {
    const result = await this.usersService.updateProfile(user.id, body);
    return ResponseSuccess(
      `user ${result.id} updated ${result.props} succesfully`,
    );
  }

  @Delete()
  async remove(@Req() { user }: CustomRequest) {
    await this.usersService.remove(user.id);

    return ResponseSuccess(`user ${user.id} deleted succesfully.`);
  }
}
