import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MulterModule } from '@nestjs/platform-express';
import {
  MulterLocalConfigService,
  PrivateFile,
  RefreshToken,
  User,
} from '@app/common';
import { DatabaseModule } from '@app/common/database/database.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken, PrivateFile]),
    AuthModule,
    DatabaseModule,
    MulterModule.registerAsync({
      useClass: MulterLocalConfigService,
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
