import { HttpException, HttpStatus } from '@nestjs/common';
import { User } from 'src/api/users/index.entity';

export const jwtGuardException = (err: any, info: any) => {
  const { message, name } = err || info;
  throw new HttpException(`${name}-${message}`, HttpStatus.FORBIDDEN);
};
