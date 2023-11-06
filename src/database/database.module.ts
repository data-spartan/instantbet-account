import { Module } from '@nestjs/common';
import { PostgresTypeOrmQueries } from './postgres/queries/postgresTypeorm.query';
import { PostgresTypeOrmRawQueries } from './postgres/raw-queries/postgresTypeorm.rawqueries';

@Module({
  providers: [PostgresTypeOrmQueries, PostgresTypeOrmRawQueries],

  exports: [PostgresTypeOrmQueries, PostgresTypeOrmRawQueries],
})
export class DatabaseModule {}
