import { BadRequestException, HttpStatus } from '@nestjs/common';

export class InvalidPasswordFormatException extends BadRequestException {
  constructor(message: string, status = HttpStatus.BAD_REQUEST) {
    super(message, `${status}`);
  }
}
