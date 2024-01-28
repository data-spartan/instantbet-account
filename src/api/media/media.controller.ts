import {
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import { CustomRequest } from 'src/common/interfaces';
import { ResponseSuccess } from 'src/common/response-formatter';

@Controller('/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/upload')
  @UseInterceptors(FilesInterceptor('files'))
  async createFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() { user }: CustomRequest,
  ) {
    const signedUrls = await this.mediaService.uploadFiles(files, user.id);
    return ResponseSuccess('files uploaded succesfully', signedUrls);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Get('')
  async getUserMedia(@Req() { user }: CustomRequest) {
    const signedUrls = await this.mediaService.getUsersFiles(user.id);
    return ResponseSuccess('files retrieved succesfully', signedUrls);
  }
}
