import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthHelper } from './auth.helper';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { UserRolesEnum } from '../users/roles/roles.enum';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { AuthedResponse } from './interfaces/auth.interface';
import { LoginDto } from './dto/login.dto';
import { plainToInstance } from 'class-transformer';
import { ChangePasswordDto, UserDto } from '../users/dto';
import { AuthRespDto } from './dto/authResp.dto';
import { LoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    private readonly helper: AuthHelper,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    const admin: User = await this.repository.findOne({
      where: { role: UserRolesEnum.Administrator },
    });
    if (!admin) {
      this.createAdministrator();
    }
  }

  private async createAdministrator(): Promise<void> {
    const superAdminEmail = this.config.get('APP_SUPER_ADMIN_EMAIL');
    const superAdminPassword = this.config.get('APP_SUPER_ADMIN_PASSWORD');
    let admin: User = await this.repository.findOne({
      where: { email: superAdminEmail },
    });
    if (admin) {
      console.warn(`### ADMIN ###`);
      console.warn(
        `User already exists: ${admin.email}, was created: ${admin.createdAt}.`,
      );
      console.warn(`### END ADMIN ###`);
      throw new HttpException('Conflict', HttpStatus.CONFLICT);
    }
    admin = new User();
    admin.firstName = 'Super';
    admin.lastName = 'Admin';
    admin.email = superAdminEmail;
    admin.role = UserRolesEnum.Administrator;
    admin.password = await this.helper.encodePassword(superAdminPassword);

    const registerAdmin = await this.repository.save(admin);

    if (!registerAdmin) {
      console.warn(`### ADMIN ###`);
      console.warn(`Administrator creation failed.`);
      console.warn(`### END ADMIN ###`);
      throw new HttpException('Something went wrong', HttpStatus.FORBIDDEN);
    } else {
      console.warn(`### ADMIN ###`);
      console.warn(
        `Administrator creation success. Admin e-mail: ${admin.email}`,
      );
      console.warn(`### END ADMIN ###`);
    }
  }

  public async register({
    firstName,
    lastName,
    email,
    password,
  }: RegisterDto): Promise<AuthedResponse | never> {
    let user: User = await this.repository.findOne({
      select: { id: true },
      where: { email },
    });
    if (user) {
      throw new HttpException('User already registered', HttpStatus.CONFLICT);
    }

    user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.password = await this.helper.encodePassword(password);

    const registerUser = await this.repository.save(user);

    if (!registerUser) {
      throw new HttpException('Something went wrong', HttpStatus.FORBIDDEN);
    }

    const token = this.helper.generateToken(user);

    // return await this.entityToDto(user, token);
    return {
      token,
      // firstName: registerUser.firstName,
      // lastName: registerUser.lastName,
      // lastLoginAt: registerUser.lastLoginAt,
      // email: registerUser.email,
      // role: registerUser.role,
    };
  }

  public async login({
    email,
    password,
  }: LoginDto): Promise<AuthedResponse> | never {
    const user: User = await this.repository.findOne({
      select: { id: true, password: true },
      where: { email },
    });
    if (!user) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.NOT_FOUND,
      );
    }
    const isPasswordValid: boolean = await this.helper.isPasswordValid(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.repository.update(user.id, { lastLoginAt: new Date() });
    const token = this.helper.generateToken(user);

    // return this.entityToDto(user, token);
    return {
      token,
    };
  }

  public async me(id: string): Promise<User> {
    const fetchedUser = await this.repository.findOne({
      // select: { , password: false },
      where: { id },
    });
    console.log(fetchedUser);
    return fetchedUser;
  }

  public async changePassword(
    { currentPassword, newPassword }: ChangePasswordDto,
    id: string,
  ) {
    const userExists: User = await this.repository.findOne({
      select: { id: true, password: true },
      where: { id },
    });

    if (!userExists) {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid: boolean = await this.helper.isPasswordValid(
      currentPassword,
      userExists.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.NOT_FOUND);
    }

    const hashedPassword = await this.helper.encodePassword(newPassword);

    this.repository.update(userExists.id, { password: hashedPassword });

    return true;
  }
}
