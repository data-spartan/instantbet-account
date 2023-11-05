import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { DataSource } from 'typeorm';

export const refreshTokenTransaction = async (
  dataSource: DataSource,
  entity: EntityClassOrSchema,
  hashedRefreshToken: string,
  propertyObject: Object,
  id: string,
) => {
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
};
