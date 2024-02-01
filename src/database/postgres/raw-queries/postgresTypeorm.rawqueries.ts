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

  public async usersQueryPagination(sign: string, params: string[]) {
    let andConditions = '';
    const columns = `"id","email","verifiedEmail","role","createdAt"`;
    // index + 4 -> we have $1,$2,$3 and by adding +4 we ensure that every param gets own $ placeholder
    if (params.length > 0) {
      andConditions =
        'AND ' +
        params.map((prop, index) => `"${prop}" = $${index + 4}`).join(' AND ');
    }
    const query = `
    SELECT ${columns}
    FROM public.users
    WHERE ("createdAt", "id") ${sign} ($1, $2) ${andConditions}
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
