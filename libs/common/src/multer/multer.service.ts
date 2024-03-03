import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { extname } from 'path';
import {
  ALLOWED_FILE_SIZE_TO_UPLOAD,
  ALLOWED_NUMBER_OF_FILES_TO_UPLOAD,
} from './multer.consts';
import { fileExtensionAccepted } from './multer.utility';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  createMulterOptions(): MulterModuleOptions {
    return {
      limits: {
        //these values are passed internally to fileFilter to be checked for each file
        fileSize: ALLOWED_FILE_SIZE_TO_UPLOAD,
        files: ALLOWED_NUMBER_OF_FILES_TO_UPLOAD,
      },
      fileFilter: (
        _req: Express.Request,
        { mimetype, originalname }: Express.Multer.File,
        cb: (error: Error, acceptFile: boolean) => void,
      ) => {
        if (fileExtensionAccepted(mimetype)) {
          cb(null, true);
        } else {
          cb(
            new HttpException(
              `Unsupported file type ${extname(originalname)}`,
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
      },
    };
  }
}
