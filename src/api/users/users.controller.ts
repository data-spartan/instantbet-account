import {
  Controller,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UserRolesEnum } from './roles/roles.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';

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
}
