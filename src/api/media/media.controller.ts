import {
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';

@Controller('/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/uploads')
  @UseInterceptors(FilesInterceptor('file'))
  async createImage(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.mediaService.uploadFile(files);
  }
}
