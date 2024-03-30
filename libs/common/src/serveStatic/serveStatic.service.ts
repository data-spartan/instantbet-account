import {
  ServeStaticModuleOptions,
  ServeStaticModuleOptionsFactory,
} from '@nestjs/serve-static';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { ServeStaticConfigEnum } from '../types/serveStatic.type';

@Injectable()
export class ServeStaticConfigService
  implements ServeStaticModuleOptionsFactory
{
  @Inject(ConfigService)
  private readonly config: ConfigService;

  onModuleInit() {
    const publicFolderUrl = join(
      // this.config.get<string>('APP_ROOT_DIR'),
      this.config.get<string>(ServeStaticConfigEnum.APP_FILE_PUBLIC_IMAGES_DIR),
    );
    if (!existsSync(publicFolderUrl)) {
      console.warn(`### Serve Static Module ###`);
      console.warn(
        `Folder for static serving doesn't exist. Creating: ${this.config.get<string>(
          ServeStaticConfigEnum.APP_FILE_PUBLIC_IMAGES_DIR,
        )}.`,
      );
      console.warn(`### Serve Static Module END ###`);
      mkdirSync(publicFolderUrl, { recursive: true });
    }
  }

  createLoggerOptions():
    | ServeStaticModuleOptions[]
    | Promise<ServeStaticModuleOptions[]> {
    return [
      {
        //virtual path for client to hit http://localhost:5000/uploads/image.png
        //must be /dir
        serveRoot: join('/', 'uploads'),
        rootPath: join(
          this.config.get<string>(ServeStaticConfigEnum.APP_ROOT_DIR),
          this.config.get<string>(
            ServeStaticConfigEnum.APP_FILE_PUBLIC_IMAGES_DIR,
          ),
        ), //physical path on server for media to get
        exclude: [
          `/${this.config.get<string>(ServeStaticConfigEnum.APP_API_PREFIX)}*`,
          //specify routes that should be excluded from static file serving.
        ],
      },
    ];
  }
}
