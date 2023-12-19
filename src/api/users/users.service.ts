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
    cursor: Date,
    userId: string,
    limit: number,
    direction: string,
  ): Promise<User[]> {
    try {
      return this.postgresQueries.allUsersPagination(
        User,
        cursor,
        userId,
        limit,
        direction,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  public async findAllQuery(
    cursor: Date,
    userId: string,
    limit: number,
    direction: string,
    queryParams: any,
  ): Promise<User[]> {
    try {
      return this.postgresQueries.usersQueryPagination(
        User,
        cursor,
        userId,
        limit,
        direction,
        queryParams,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
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

  async updateProfile(id: User['id'], attrs: Partial<User>) {
    try {
      await this.userRepo.update({ id }, { ...attrs });
      return { id, props: `${Object.keys(attrs).join(',')}` };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  //admin only can create testing user
  public async createTestUser(body: CreateTestUserDto): Promise<User> {
    try {
      body.password = await this.authHelper.encodePassword(body.password);
      return this.userRepo.save(body);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  public async remove(id: string): Promise<void> {
    try {
      await this.userRepo.delete(id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
