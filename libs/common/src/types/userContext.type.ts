import { Request } from 'express';
import { User } from '../entities';

// export interface PartialUser {PartialType<User>}

export interface UserContext extends Request {
  user: User;
}
