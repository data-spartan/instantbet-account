import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ALLOWED_FILE_SIZE_TO_UPLOAD } from './multer.consts';
import { fileExtensionAccepted } from './multer.utility';
import { ServeStaticConfigEnum } from 'src/constants/serveStatic.enum';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  onModuleInit() {
    const tempFolderUrl = this.config.get<string>(
      ServeStaticConfigEnum.APP_FILE_PUBLIC_IMAGES_DIR,
    );
    if (!existsSync(tempFolderUrl)) {
      console.warn(`### Multer Service Module ###`);
      console.warn(
        `Folder for static serving doesn't exist. Creating: ${this.config.get<string>(
          ServeStaticConfigEnum.APP_FILE_PUBLIC_IMAGES_DIR,
        )}.`,
      );
      console.warn(`### Multer Service Module END ###`);
      mkdirSync(tempFolderUrl, { recursive: true });
    }
  }

  createMulterOptions(): MulterModuleOptions {
    return {
      limits: { fileSize: ALLOWED_FILE_SIZE_TO_UPLOAD },
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
      storage: diskStorage({
        destination: join(
          // this.config.get<string>('APP_ROOT_DIR'),
          this.config.get<string>(
            ServeStaticConfigEnum.APP_FILE_PUBLIC_IMAGES_DIR,
          ),
        ),
        filename: (
          _req: Express.Request,
          file: Express.Multer.File,
          cb: (error: Error, destination: string) => void,
        ) => {
          cb(null, `${Date.now()}_${file.originalname}`);
        },
      }),
    };
  }
}
