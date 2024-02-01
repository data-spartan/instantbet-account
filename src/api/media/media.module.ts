import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from '../../shared/multer/multer.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrivateFile, User } from '../users/index.entity';
import { S3Provider } from './s3.provider';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    AuthModule,
    TypeOrmModule.forFeature([PrivateFile, User]),
  ],
  providers: [MediaService, S3Provider],
  controllers: [MediaController],
  exports: [MediaService],
})
export class MediaModule {}
