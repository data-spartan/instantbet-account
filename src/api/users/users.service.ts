import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  public async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  public async findOne(id: string): Promise<User> {
    return this.repository.findOneBy({ id });
  }

  public async getByEmail(email: string): Promise<User> {
    try {
      return await this.repository.findOneOrFail({
        where: { email: email },
      });
    } catch (e) {
      throw new Error(`Couldn't retrieve a user with that E-mail.`);
    }
  }
  //TODO ADD EXC FILTER FOR UNIQUE CONT VIOLATED
  async updateMyProfile(reqUser: User, attrs: Partial<User>) {
    const user = await this.findOne(reqUser.id);
    if (!user) throw new NotFoundException('user not found');
    Object.assign(user, attrs);
    return this.repository.save(user);
  }

  public async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
