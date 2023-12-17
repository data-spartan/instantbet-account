import { OmitType, PickType } from '@nestjs/mapped-types';
import { Trim } from 'class-sanitizer';
import { IsEmail, IsString } from 'class-validator';
import { RegisterDto } from './register.dto';

export class LoginDto extends PickType(RegisterDto, ['email', 'password']) {}
