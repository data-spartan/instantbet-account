import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateTestUserDto } from '../admin/dto';
import { AuthHelper } from '../auth/auth.helper';
import { LoggerService } from 'src/common/logger/logger.service';
import { allUsersPagination } from 'src/database/postgres/queries/allUsersPagination.query';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private authHelper: AuthHelper,
    private readonly dataSource: DataSource,
  ) {}

  public async findAll(
    limit: number,
    cursor: string,
    timestamp: Date,
    direction: string,
  ): Promise<User[]> {
    // return this.repository.find();
    return allUsersPagination(
      this.dataSource,
      User,
      timestamp,
      cursor,
      limit,
      direction,
    );
  }

  public async findOne(id: string): Promise<User> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new HttpException(`user with id: ${id} not found`, 404);

    return user;
  }

  public async findByEmail(email: string): Promise<User> {
    try {
      return await this.userRepo.findOneOrFail({
        where: { email: email },
      });
    } catch (e) {
      throw new NotFoundException(`user with email: ${email} not found`);
    }
  }

  async updateMyProfile(user: User, attrs: Partial<User>) {
    if (!user)
      throw new HttpException(`user with id: ${user.id} not found`, 404);

    Object.assign(user, attrs);
    this.userRepo.save(user);
    return { id: user.id, props: `${Object.keys(attrs).join(',')}` };
  }

  //admin could create testing user
  public async createTestUser(body: CreateTestUserDto): Promise<User> {
    body.password = await this.authHelper.encodePassword(body.password);
    return this.userRepo.save(body);
  }

  public async remove(id: string): Promise<void> {
    await this.userRepo.delete(id);
  }
}
