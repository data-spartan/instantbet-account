import {
  ServeStaticModuleOptions,
  ServeStaticModuleOptionsFactory,
} from '@nestjs/serve-static';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { ServeStaticConfigEnum } from 'src/constants/serveStatic.enum';

@Injectable()
export class ServeStaticConfigService
  implements ServeStaticModuleOptionsFactory
{
  @Inject(ConfigService)
  private readonly config: ConfigService;

  onModuleInit() {
    const publicFolderUrl = join(
      this.config.get<string>('APP_ROOT_DIR'),
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
        serveRoot: `${this.config.get<string>(
          ServeStaticConfigEnum.APP_FILE_SERVE_PUBLIC_URL,
        )}`,
        rootPath: join(
          this.config.get<string>('APP_ROOT_DIR'),
          this.config.get<string>(
            ServeStaticConfigEnum.APP_FILE_PUBLIC_IMAGES_DIR,
          ),
        ),
        exclude: [
          `/${this.config.get<string>(ServeStaticConfigEnum.APP_API_PREFIX)}*`,
        ],
      },
    ];
  }
}
