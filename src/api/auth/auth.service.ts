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
    let user: User = await this.repository.findOne({ where: { email } });

    if (user) {
      throw new HttpException('Conflict', HttpStatus.CONFLICT);
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

    return {
      token,
      firstName: registerUser.firstName,
      lastName: registerUser.lastName,
      lastLoginAt: registerUser.lastLoginAt,
      email: registerUser.email,
      role: registerUser.role,
    };
  }
  public async login({
    email,
    password,
  }: LoginDto): Promise<AuthedResponse> | never {
    const user: User = await this.repository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }
    const isPasswordValid: boolean = await this.helper.isPasswordValid(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }
    await this.repository.update(user.id, { lastLoginAt: new Date() });
    const token = this.helper.generateToken(user);

    return {
      token,
      firstName: user.firstName,
      lastName: user.lastName,
      lastLoginAt: user.lastLoginAt,
      email: user.email,
      role: user.role,
    };
  }

  public async me(user: User): Promise<User> {
    const fetchedUser = await this.repository.findOneBy({ id: user.id });
    delete fetchedUser.password;
    return fetchedUser;
  }
}
