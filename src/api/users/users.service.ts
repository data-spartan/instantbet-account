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
// import { LoggerService } from 'src/logger/logger.service';
import { PostgresTypeOrmQueries } from 'src/database/postgres/queries/postgresTypeorm.query';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private authHelper: AuthHelper,
    private readonly postgresQueries: PostgresTypeOrmQueries,
  ) {}

  public async findAll(
    limit: number,
    cursor: string,
    timestamp: Date,
    direction: string,
  ): Promise<User[]> {
    try {
      return this.postgresQueries.allUsersPagination(
        User,
        timestamp,
        cursor,
        limit,
        direction,
      );
    } catch (error) {}
  }

  public async findOne(id: string): Promise<User> {
    try {
      const user = await this.userRepo.findOneByOrFail({ id });
      return user;
    } catch (error) {
      throw new HttpException(`user with id: ${id} not found`, 404);
    }
  }

  public async findByEmail(email: string): Promise<User> {
    try {
      return await this.userRepo.findOneByOrFail({ email });
    } catch (e) {
      throw new NotFoundException(`user with email: ${email} not found`);
    }
  }

  async updateProfile(user: User, attrs: Partial<User>) {
    try {
      Object.assign(user, attrs);
      this.userRepo.save(user);
      return { id: user.id, props: `${Object.keys(attrs).join(',')}` };
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //admin could create testing user
  public async createTestUser(body: CreateTestUserDto): Promise<User> {
    try {
      body.password = await this.authHelper.encodePassword(body.password);
      return this.userRepo.save(body);
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async remove(id: string): Promise<void> {
    try {
      await this.userRepo.delete(id);
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
