import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTestUserDto } from '../admin/dto';
import { AuthHelper } from '../auth/auth.helper';
// import { LoggerService } from 'src/logger/logger.service';
import { unlink } from 'fs';
import { PostgresTypeOrmQueries } from '@account/database/postgres/queries/postgresTypeorm.query';
import { User } from '@app/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private authHelper: AuthHelper,
    private readonly postgresQueries: PostgresTypeOrmQueries,
  ) {}

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
      return await this.userRepo.findOneByOrFail({ id });
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

  async updateProfile(
    user: User,
    attrs: Partial<User>,
    avatar: Express.Multer.File,
  ) {
    try {
      if (avatar) {
        attrs.avatar = avatar.path;
      }
      if (user.avatar) {
        unlink(user.avatar, (err) => {
          if (err) {
            // throw err;
            console.log(err);
          }
        });
      }
      await this.userRepo.update({ id: user.id }, { ...attrs });
      return { id: user.id, props: `${Object.keys(attrs).join(',')}` };
    } catch (error) {
      unlink(avatar.path, () => {
        throw new HttpException(error.message, error.status);
      });
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
