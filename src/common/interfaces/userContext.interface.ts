import { Request } from 'express';
import { User } from 'src/api/users/index.entity';

// export interface PartialUser {PartialType<User>}

export interface UserContext extends Request {
  user: User;
}
