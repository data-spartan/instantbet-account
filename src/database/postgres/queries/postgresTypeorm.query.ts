import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { DataSource, Entity, QueryRunner } from 'typeorm';
import { User } from 'src/api/users/index.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PostgresTypeOrmRawQueries } from '../raw-queries/postgresTypeorm.rawqueries';

@Injectable()
export class PostgresTypeOrmQueries {
  // private readonly queryRunner: QueryRunner;
  constructor(
    private dataSource: DataSource,
    private rawQueries: PostgresTypeOrmRawQueries,
  ) {
    // this.queryRunner = this.dataSource.createQueryRunner();
  }
  public async allUsersPagination(
    //in cursor pag with uuid, date/timestamp is in fact cursor and uuid is here to compare which date is greater/smaller when dates are equal
    //bcs uuid is hash, compare is random
    entity: any,
    cursor: Date,
    userId: string,
    limit: number,
    direction: string,
  ): Promise<User[]> {
    //CURSOR PAGINATION
    const sign = direction === 'Next' ? `<` : `>`; //next is clicked sign < is evaluated bcs we need older records
    //if Next page is clicked, FE needs to send last record(oldest) in  user array; Send CreatedAt, id, direction(Next) from previous array
    //to able to to show older records than CreatedAt
    //when Previous is clicked first record in array is sent.

    const queryRunner = this.dataSource.createQueryRunner();
    const rawQuery = await this.rawQueries.allUsersPagination(sign);
    await queryRunner.connect();
    const users = await queryRunner.query(rawQuery, [cursor, userId, limit]);
    await queryRunner.release();
    return users;
  }

  public async refreshTokenTransaction(
    entity: EntityClassOrSchema,
    hashedRefreshToken: string,
    propertyObject: Object,
    id: string,
  ) {
    // const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = queryRunner.manager;
    try {
      await manager.delete(entity, propertyObject); //{ user: id }
      const insertResult = await manager.insert(entity, {
        refreshToken: hashedRefreshToken,
        user: id,
      });
      await queryRunner.commitTransaction();
      return insertResult;
    } catch (error) {
      await queryRunner.rollbackTransaction().catch((error: Error) => {
        throw error;
      });
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }

    // const insertResult = await this.dataSource.manager.transaction(
    //   async (transEntMan) => {
    //     await transEntMan.delete(entity, propertyObject); //{ user: id }
    //     const insertResult = await transEntMan.insert(entity, {
    //       refreshToken: hashedRefreshToken,
    //       user: id,
    //     });
    //     return insertResult;
    //   },
    // );
  }
}
