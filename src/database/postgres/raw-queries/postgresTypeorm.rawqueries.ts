import { Injectable } from '@nestjs/common';

@Injectable()
export class PostgresTypeOrmRawQueries {
  public async allUsersPagination(sign: string) {
    const columns = `"id","firstName", "lastName", "telephone","email","verifiedEmail","role","createdAt","updatedAt","lastLoginAt"`;
    const query = `
    SELECT ${columns}
    FROM public.users
    WHERE ("createdAt", "id") ${sign} ($1, $2)
    ORDER BY "createdAt" DESC
    LIMIT $3;`;
    //WHERE ... row constructor -> first checks created_at < x, unless these values are equal, in which case it compares id and y`.
    return query;
  }
}
