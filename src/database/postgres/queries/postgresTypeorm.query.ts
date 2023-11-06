import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { DataSource, Entity, QueryRunner } from 'typeorm';
import { User } from 'src/api/users/index.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostgresTypeOrmQueries {
  private readonly queryRunner: QueryRunner;
  constructor(private dataSource: DataSource) {
    this.queryRunner = this.dataSource.createQueryRunner();
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
    const columns = `"id","firstName", "lastName", "telephone","email","verifiedEmail","role","createdAt","updatedAt","lastLoginAt"`;
    const query = `
    SELECT ${columns}
    FROM public.users
    WHERE ("createdAt", "id") ${sign} ($1, $2)
    ORDER BY "createdAt" DESC
    LIMIT $3;
  `;
    //WHERE ... row constructor -> first checks created_at < x, unless these values are equal, in which case it compares id and y`.
    await this.queryRunner.connect();
    const users = await this.queryRunner.query(query, [cursor, userId, limit]);
    await this.queryRunner.release();
    return users;
  }
}
