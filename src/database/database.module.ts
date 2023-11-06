import { Module } from '@nestjs/common';
import { PostgresTypeOrmQueries } from './postgres/queries/postgresTypeorm.query';
import { PostgresTypeOrmTransactions } from './postgres/transactions_/postgresTypeorm.transactions';

@Module({
  providers: [PostgresTypeOrmQueries, PostgresTypeOrmTransactions],

  exports: [PostgresTypeOrmQueries, PostgresTypeOrmTransactions],
})
export class DatabaseModule {}
