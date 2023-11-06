import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';

@Injectable()
export class PostgresTypeOrmTransactions {
  private readonly queryRunner: QueryRunner;
  constructor(private readonly dataSource: DataSource) {
    this.queryRunner = this.dataSource.createQueryRunner();
  }

  public async refreshTokenTransaction(
    entity: EntityClassOrSchema,
    hashedRefreshToken: string,
    propertyObject: Object,
    id: string,
  ) {
    // const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    const manager = this.queryRunner.manager;
    try {
      await manager.delete(entity, propertyObject); //{ user: id }
      const insertResult = await manager.insert(entity, {
        refreshToken: hashedRefreshToken,
        user: id,
      });
      await this.queryRunner.commitTransaction();
      return insertResult;
    } catch (error) {
      await this.queryRunner.rollbackTransaction().catch((error: Error) => {
        throw error;
      });
      throw new InternalServerErrorException(error);
    } finally {
      await this.queryRunner.release();
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
