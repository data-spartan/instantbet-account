import {
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  Body,
  Req,
  Post,
  Delete,
  Query,
  HttpCode,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserRolesEnum } from '../users/roles/roles.enum';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import { CreateTestUserDto } from './dto/createTestUser.dto';
import { UserContext } from 'src/common/interfaces';
import { UserUpdateDto } from '../users/dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ResponseSuccess } from 'src/common/response-formatter';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsersPaginationQueryDto } from '../users/dto/usersPaginationQuery.dto';
import { CheckIdDto } from 'src/common/dto/checkId.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRolesEnum.Administrator)
export class AdminController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/users/search')
  @HttpCode(200)
  public async findAllQuery(@Query() query: UsersPaginationQueryDto) {
    //http://localhost:5000/admin/users?timestamp=2023-10-02 14:11:29.400&limit=2&cursor=c5369eed-fb5d-467a-a151-b6e77bee5783&direction=Next
    const { cursor, userId, limit, direction, ...rest } = query;
    const result = await this.usersService.findAllQuery(
      cursor,
      userId,
      limit,
      direction,
      rest,
    );
    return ResponseSuccess(`users retrieved succesfully`, result);
  }

  @Get('/users/:id')
  @HttpCode(200)
  public async findOne(@Param() { id }: CheckIdDto) {
    const result = await this.usersService.findOne(id);
    return ResponseSuccess(`user ${id} retrieved succesfully`, result);
  }

  @Post('/users')
  public async createTestUser(@Body() body: CreateTestUserDto) {
    const result = await this.usersService.createTestUser(body);
    return ResponseSuccess(`test user created succesfully`, result);
  }

  @Delete('/users/:id')
  public async removeUser(@Param() { id }: CheckIdDto) {
    await this.usersService.remove(id);
    return ResponseSuccess(`user ${id} deleted succesfully`);
  }

  @Get('/me')
  private async me(@Req() { user }: UserContext) {
    const result = await this.usersService.findOne(user.id);
    return ResponseSuccess(`Retrieved user ${user.id} profile.`, result);
  }

  @Patch('/me')
  @UseInterceptors(FileInterceptor('avatar'))
  async update(
    @Req() { user }: UserContext,
    @Body() body: UserUpdateDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    const result = await this.usersService.updateProfile(user, body, avatar);

    return ResponseSuccess(
      `user ${result.id} updated ${result.props} succesfully`,
    );
  }
}
