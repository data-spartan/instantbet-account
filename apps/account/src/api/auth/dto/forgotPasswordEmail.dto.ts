import { PickType } from '@nestjs/mapped-types';
import { RegisterDto } from './register.dto';

export class ForgotPasswordEmailDto extends PickType(RegisterDto, ['email']) {}
