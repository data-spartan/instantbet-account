import { Request } from 'express';
import { User } from 'src/api/users/index.entity';

export interface CustomRequest extends Request {
  user: User;
}
