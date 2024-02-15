import {
  Body,
  Controller,
  Delete,
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
import { DeleteMediaDto } from './dto/deleteMedia.dto';
import { UserContext } from 'libs/common/src';
import { ResponseSuccess } from 'libs/common/src/response-formatter/successResponse.formater';

@Controller('/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/upload')
  @UseInterceptors(FilesInterceptor('files'))
  async createFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() { user }: UserContext,
  ) {
    const signedUrls = await this.mediaService.uploadFiles(files, user.id);
    return ResponseSuccess('files uploaded succesfully', signedUrls);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Get('')
  async getUserMedia(@Req() { user }: UserContext) {
    const signedUrls = await this.mediaService.getUsersFiles(user.id);
    return ResponseSuccess('files retrieved succesfully', signedUrls);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Delete('')
  async deleteUserMedia(@Body() { deleteFiles }: DeleteMediaDto) {
    await this.mediaService.deleteFiles(deleteFiles);
    return ResponseSuccess('files deleted succesfully');
  }
}
