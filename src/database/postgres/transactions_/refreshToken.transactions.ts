import { Injectable } from '@nestjs/common';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { DataSource } from 'typeorm';

@Injectable()
export class PostgresTypeOrmTransactions {
  public async refreshTokenTransaction(
    dataSource: DataSource,
    entity: EntityClassOrSchema,
    hashedRefreshToken: string,
    propertyObject: Object,
    id: string,
  ) {
    const insertResult = await dataSource.manager.transaction(
      async (transEntMan) => {
        await transEntMan.delete(entity, propertyObject); //{ user: id }
        const insertResult = await transEntMan.insert(entity, {
          refreshToken: hashedRefreshToken,
          user: id,
        });
        return insertResult;
      },
    );
    return insertResult;
  }
}
