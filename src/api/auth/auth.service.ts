import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
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
import { ChangePasswordDto } from '../users/dto';
import { AuthRespDto } from './dto/authResp.dto';
// import { LoggerService } from 'src/logger/logger.service';
import { ITokenType } from './interfaces/token.interface';
import * as argon2 from 'argon2';
import * as dayjs from 'dayjs';
import { RefreshToken } from '../users/index.entity';
import { MailService } from 'src/mailer/mail.service';
import { ForgotPasswordEmailDto } from './dto';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly tokenRepo: Repository<RefreshToken>,
    private readonly authHelper: AuthHelper,
    private readonly config: ConfigService,
    private readonly logger: Logger,
    private readonly mailService: MailService,
  ) {}

  async onModuleInit(): Promise<void> {
    const admin: User = await this.userRepo.findOne({
      where: { role: UserRolesEnum.Administrator },
    });
    if (!admin) {
      this.createAdministrator();
    }
  }

  private async createAdministrator(): Promise<void> {
    const superAdminEmail = this.config.get('APP_SUPER_ADMIN_EMAIL');
    const superAdminPassword = this.config.get('APP_SUPER_ADMIN_PASSWORD');
    const superAdminDateOfBirth = this.config.get(
      'APP_SUPER_ADMIN_DATEOFBIRTH',
    );
    let admin: User | null = await this.userRepo.findOne({
      where: { email: superAdminEmail },
    });
    if (admin) {
      this.logger.warn(
        `Admin User already exists: ${admin.email}, was created: ${admin.createdAt}.`,
      );
      throw new HttpException('Conflict', HttpStatus.CONFLICT);
    }
    admin = Object();
    admin.firstName = 'Super';
    admin.lastName = 'Admin';
    admin.email = superAdminEmail;
    admin.role = UserRolesEnum.Administrator;
    admin.password = await this.authHelper.encodePassword(superAdminPassword);
    admin.dateOfBirth = superAdminDateOfBirth;

    const registerAdmin = await this.userRepo.save(admin);

    if (!registerAdmin) {
      this.logger.warn(`Administrator creation failed.`);
      throw new HttpException('Something went wrong', HttpStatus.FORBIDDEN);
    } else {
      this.logger.warn(
        `Administrator creation success. Admin e-mail: ${admin.email}`,
      );
      this.authHelper.confirmEmail(admin.email, null);
    }
  }

  public async register(registerDto: RegisterDto) {
    let user: User = await this.userRepo.findOne({
      select: { id: true },
      where: { email: registerDto.email },
    });
    if (user) {
      throw new HttpException('User already registered', HttpStatus.CONFLICT);
    }

    user = new User(registerDto);
    user.password = await this.authHelper.encodePassword(user.password);

    const { emailToken } = await this.authHelper.getJwtEmailToken(user.email);
    // const token = await this.authHelper.handleTokens(user);
    user.verifyEmailToken = await this.authHelper.hashData(emailToken);

    const registerUser = await this.userRepo.insert(user);

    if (!registerUser) {
      throw new HttpException('Something went wrong', HttpStatus.FORBIDDEN);
    }

    await this.mailService.sendVerificationEmail(
      user.email,
      // user.firstName,
      // user.lastName,
      emailToken,
    );

    return user.id;
  }

  public async login({ email, password }: LoginDto) {
    const user: User = await this.userRepo.findOne({
      select: {
        id: true,
        password: true,
        email: true,
        verifiedEmail: true,
        role: true,
      },
      where: { email },
    });
    if (!user) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.NOT_FOUND,
      );
    }
    const isPasswordValid: boolean = await this.authHelper.isPasswordValid(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.NOT_FOUND,
      );
    }
    // if (!user.verifiedEmail)
    //   throw new HttpException('Confirm your email first', HttpStatus.FORBIDDEN);

    const token = await this.authHelper.generateLoginTokens(user);
    await this.userRepo.update(user.id, { lastLoginAt: new Date() });
    return {
      token,
      id: user.id,
    };
  }

  public async resendVerificationEmail(user: User) {
    if (user.verifiedEmail) {
      throw new BadRequestException('Email already confirmed');
    }
    const { emailToken } = await this.authHelper.getJwtEmailToken(user.email);
    const hashedEmailToken = await this.authHelper.hashData(emailToken);
    await this.mailService.sendVerificationEmail(
      user.email,
      // user.firstName,
      // user.lastName,
      emailToken,
    );
    this.userRepo.update(user.id, { verifyEmailToken: hashedEmailToken });
  }

  public async signOut(userId: string) {
    try {
      await this.tokenRepo
        .createQueryBuilder()
        .delete()
        .from(RefreshToken)
        .where('userId = :userId', { userId })
        .execute();
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  public async changePassword(
    { currentPassword, newPassword }: ChangePasswordDto,
    user: User,
  ) {
    // const userExists: User = await this.userRepo.findOne({
    //   select: { id: true, password: true },
    //   where: { id },
    // });

    if (!user) {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid: boolean = await this.authHelper.isPasswordValid(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.NOT_FOUND);
    }

    const hashedPassword = await this.authHelper.encodePassword(newPassword);

    this.userRepo.update(user.id, { password: hashedPassword });

    return true;
  }

  public async confirmForgotPassword(newPassword: string, id: string) {
    const hashedPassword = await this.authHelper.encodePassword(newPassword);

    await this.userRepo.update(id, {
      password: hashedPassword,
      verifyEmailToken: null,
    });

    return true;
  }

  public async forgotPassword({
    email,
  }: ForgotPasswordEmailDto): Promise<boolean> {
    const user: User = await this.userRepo.findOne({
      select: {
        id: true,
        email: true,
        verifyEmailToken: true,
        role: true,
      },
      where: { email },
    });
    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

    const { emailToken } = await this.authHelper.getJwtEmailToken(user.email);
    const hashedEmailToken = await this.authHelper.hashData(emailToken);

    await this.mailService.sendForgotPasswordEmail(user.email, emailToken);
    this.userRepo.update(user.id, { verifyEmailToken: hashedEmailToken });
    return true;
  }

  public async refreshTokens(user) {
    try {
      const { refreshToken } = user;
      const tokens = await this.authHelper.getUserIfRefreshTokenMatches(
        refreshToken,
        user.id,
      );
      return tokens;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
