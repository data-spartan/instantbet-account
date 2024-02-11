import { DataSource, EntityTarget } from 'typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PostgresTypeOrmRawQueries } from '../raw-queries/postgresTypeorm.rawqueries';
import { RefreshTokenI } from 'src/api/auth/interfaces';
import { RefreshToken } from '@app/common/entities';

@Injectable()
export class PostgresTypeOrmQueries {
  // private readonly queryRunner: QueryRunner;
  constructor(
    private dataSource: DataSource,
    private rawQueries: PostgresTypeOrmRawQueries,
  ) {
    // this.queryRunner = this.dataSource.createQueryRunner();
  }

  public async usersQueryPagination(
    //in cursor pag with uuid, date/timestamp is in fact cursor and uuid is here to compare which date is greater/smaller when dates are equal
    //bcs uuid is hash, compare is random
    entity: any,
    cursor: Date,
    userId: string,
    limit: number,
    direction: string,
    queryParams: any,
  ): Promise<any> {
    //CURSOR PAGINATION
    const sign = direction === 'Next' ? `<` : `>`; //next is clicked sign < is evaluated bcs we need older records
    //if Next page is clicked, FE needs to send last record(oldest) in  user array; Send CreatedAt, id, direction(Next) from previous array
    //to able to to show older records than CreatedAt
    //when Previous is clicked first record in array is sent.
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const paramsKeysValues = {
        keys: Object.keys(queryParams),
        values: Object.values(queryParams),
      };
      const allUsersQuery = await this.rawQueries.usersQueryPagination(
        sign,
        paramsKeysValues.keys,
      );

      const usersCountQuery = await this.rawQueries.allUsersCount();
      const users = await queryRunner.query(allUsersQuery, [
        cursor,
        userId,
        limit,
        ...paramsKeysValues.values,
      ]);
      //count always returns bigint so js automaticaly returns string-use parseint
      const totalCount = parseInt(
        (await queryRunner.query(usersCountQuery))[0]['totalcount'],
      );
      await queryRunner.commitTransaction();
      return { users, totalCount };
    } catch (error) {
      await queryRunner.rollbackTransaction().catch((error: Error) => {
        throw error;
      });
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  public async refreshTokenLoginTransaction(
    entity: EntityTarget<RefreshToken>,
    hashedRefreshToken: string,
    userId: string,
    tokenId: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = queryRunner.manager;
    try {
      await manager.delete(entity, { user: userId, id: tokenId }); //{ user: id }
      const insertResult = await manager.insert(entity, {
        id: tokenId,
        refreshToken: hashedRefreshToken,
        user: userId,
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
  }

  public async refreshTokenTransaction(
    entity: EntityTarget<RefreshToken>,
    hashedRefreshToken: string,
    payload: RefreshTokenI,
    newtokenId: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = queryRunner.manager;
    try {
      await manager.delete(entity, { user: payload.sub, id: payload.tokenId }); //{ user: id }
      const insertResult = await manager.insert(entity, {
        id: newtokenId,
        refreshToken: hashedRefreshToken,
        user: payload.sub,
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
