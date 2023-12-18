import { Injectable } from '@nestjs/common';

@Injectable()
export class PostgresTypeOrmRawQueries {
  public async allUsersPagination(sign: string) {
    const columns = `"id","email","verifiedEmail","role","createdAt"`;
    const query = `
    SELECT ${columns}
    FROM public.users
    WHERE ("createdAt", "id") ${sign} ($1, $2)
    ORDER BY "createdAt" DESC
    LIMIT $3;`;
    //WHERE ... row constructor -> first checks created_at < x, unless these values are equal, in which case it compares id and y`.
    return query;
  }

  public async usersQueryPagination(sign: string, params: any) {
    const columns = `"id","email","verifiedEmail","role","createdAt"`;

    const andConditions = params
      .map((prop, index) => `"${prop}" = $${index + 4}`)
      .join(' AND ');
    const query = `
    SELECT ${columns}
    FROM public.users
    WHERE ("createdAt", "id") ${sign} ($1, $2) AND ${andConditions}
    ORDER BY "createdAt" DESC
    LIMIT $3;`;
    //WHERE ... row constructor -> first checks created_at < x, unless these values are equal, in which case it compares id and y`.
    return query;
  }

  public async allUsersCount() {
    //Index-Only Scan
    const query = `
    SELECT COUNT(*) as totalCount
    FROM (SELECT DISTINCT "id" FROM public.users) users`;
    return query;
  }
}
