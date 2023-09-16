import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as argon2 from 'argon2';
import { TokenTypeI } from './interfaces/token.interface';

@Injectable()
export class AuthHelper {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    private readonly jwt: JwtService,
  ) {
    this.jwt = jwt;
  }
  public async validateUser(decoded: any): Promise<User> {
    return this.repository.findOne({ where: { id: decoded.sub } });
  }

  public generateToken(user: User): string {
    return this.jwt.sign({ sub: user.id, email: user.email });
  }

  public async encodePassword(password: string): Promise<string> {
    const hashedPassword: string = await argon2.hash(password);
    return hashedPassword;
  }

  public async isPasswordValid(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    const passwordValid = await argon2.verify(userPassword, password);
    return passwordValid;
  }
}
