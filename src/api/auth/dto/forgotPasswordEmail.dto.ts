import { PickType } from '@nestjs/mapped-types';
import { Trim } from 'class-sanitizer';
import { IsDefined, IsEmail } from 'class-validator';
import { RegisterDto } from './register.dto';

export class ForgotPasswordEmailDto extends PickType(RegisterDto, ['email']) {}
