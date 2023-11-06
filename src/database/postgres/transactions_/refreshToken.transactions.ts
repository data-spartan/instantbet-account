import { Injectable } from '@nestjs/common';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { DataSource } from 'typeorm';

@Injectable()
export class PostgresTypeOrmTransactions {
  constructor(private readonly dataSource: DataSource) {}

  public async refreshTokenTransaction(
    entity: EntityClassOrSchema,
    hashedRefreshToken: string,
    propertyObject: Object,
    id: string,
  ) {
    const insertResult = await this.dataSource.manager.transaction(
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
