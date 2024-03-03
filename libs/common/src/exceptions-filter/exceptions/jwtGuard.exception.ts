import { HttpException, HttpStatus } from '@nestjs/common';

export const jwtGuardException = (err: any, info: any) => {
  const { message, name } = err || info;
  throw new HttpException(`${name}-${message}`, HttpStatus.FORBIDDEN);
};
