import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { User } from '../../entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RefreshToken } from '../../entities/token.entity';
import { DatabaseModule } from 'src/database/database.module';
import { MulterModule } from '@nestjs/platform-express';
import { MulterLocalConfigService } from 'src/libs/common/multer/multerLocal.service';
import { PrivateFile } from 'src/entities/file.entity';

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
