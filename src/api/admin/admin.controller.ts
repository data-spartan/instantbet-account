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
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { UserRolesEnum } from '../users/roles/roles.enum';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import { UserDto } from '../users/dto/user.dto';
import { CreateTestUserDto } from './dto/createTestUser.dto';
import { CustomRequest } from 'src/common/interfaces';
import { AuthService } from '../auth/auth.service';
import { UserUpdateDto } from '../users/dto';
import { UsersPaginationDto } from '../users/dto/usersPagination.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ResponseSuccess } from 'src/common/response-formatter';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRolesEnum.Administrator)
export class AdminController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/users')
  public async findAll(@Query() query: UsersPaginationDto) {
    //http://localhost:5000/admin/users?timestamp=2023-10-02 14:11:29.400&limit=2&cursor=c5369eed-fb5d-467a-a151-b6e77bee5783&direction=Next
    const { timestamp, limit, cursor, direction } = query;
    const result = await this.usersService.findAll(
      limit,
      cursor,
      timestamp,
      direction,
    );
    return ResponseSuccess(`users retrieved succesfully`, result);
  }

  @Get('/users/:id')
  public async findOne(@Param('id') id: string) {
    const result = await this.usersService.findOne(id);
    return ResponseSuccess(`user ${id} retrieved succesfully`, result);
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
    return ResponseSuccess(`user ${id} deleted succesfully`);
  }

  @Get('/me')
  private async me(@Req() { user }: CustomRequest): Promise<User | never> {
    return this.usersService.findOne(user.id);
  }

  @Patch('/me')
  async update(@Req() { user }: CustomRequest, @Body() body: UserUpdateDto) {
    const result = await this.usersService.updateProfile(user, body);

    return ResponseSuccess(
      `user ${result.id} updated ${result.props} succesfully`,
    );
  }
  @Delete(':id')
  async remove(@Param() { id }: any, @Req() { user }: CustomRequest) {
    await this.usersService.remove(id);

    return ResponseSuccess(`user ${user.id} deleted succesfully.`);
  }
}
