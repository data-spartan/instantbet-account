import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './multer/multer.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    AuthModule,
  ],
  providers: [MediaService],
  controllers: [MediaController],
  exports: [MediaService],
})
export class MediaModule {}
