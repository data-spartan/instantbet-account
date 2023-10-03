import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { DataSource, Entity } from 'typeorm';
import { User } from 'src/api/users/index.entity';

export const allUsersPagination = async (
  dataSource: DataSource,
  entity: any,
  timestamp: Date,
  cursor: string,
  limit: number,
  direction: string,
): Promise<User[]> => {
  //CURSOR PAGINATION
  const sign = direction === 'Next' ? `<` : `>`; //next is clicked sign < is evaluated bcs we need older records
  //if Next page is clicked, FE needs to save last record(oldest) user CreatedAt, id, direction(Next)
  //to able to to show older records than CreatedAt
  //when Previous is clicked oposite is done.
  const columns = `"id","firstName", "lastName", "telephone","email","verifiedEmail","role","createdAt","updatedAt","lastLoginAt"`;
  const query = `
    SELECT ${columns}
    FROM public.users
    WHERE ("createdAt", "id") ${sign} ($1, $2)
    ORDER BY "createdAt" DESC
    LIMIT $3;
  `;
  //WHERE ... row constructor -> first checks created_at < x, unless these values are equal, in which case it compares id and y`.
  const repo = dataSource.manager.getRepository(entity);
  const table = repo.metadata.tableName;
  const users = await repo.query(query, [timestamp, cursor, limit]);
  return users;
};
