import {
  Controller,
  Get,
  Patch,
  UseGuards,
  Body,
  Req,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRolesEnum } from './roles/roles.enum';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import { UserUpdateDto } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseSuccess, UserContext } from '@app/common';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) // EmailConfirmationGuard)
@Roles(UserRolesEnum.Basic, UserRolesEnum.Test)
// @Serialize(UserDto)
// @UseInterceptors(LoggingInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get('/me')
  private async me(@Req() { user }: UserContext) {
    const result = await this.usersService.findOne(user.id);
    return ResponseSuccess(`Retrieved user ${user.id} profile.`, result);
  }

  @Patch('/me')
  @UseInterceptors(FileInterceptor('avatar')) //i am using static files uploads just for showcase
  async update(
    @Req() { user }: UserContext,
    @UploadedFile() avatar: Express.Multer.File,
    @Body() body: UserUpdateDto,
  ) {
    const result = await this.usersService.updateProfile(user, body, avatar);
    return ResponseSuccess(
      `user ${result.id} updated ${result.props} succesfully.`,
    );
  }

  @Delete()
  async remove(@Req() { user }: UserContext) {
    await this.usersService.remove(user.id);

    return ResponseSuccess(`user ${user.id} deleted succesfully.`);
  }
}
