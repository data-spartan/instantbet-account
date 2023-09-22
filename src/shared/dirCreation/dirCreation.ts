import { Injectable, OnModuleInit } from '@nestjs/common';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class DirectoryCreationService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  onModuleInit() {
    // Get the base directory path from configuration
    const baseDir = this.configService.get<string>('APP_BASE_DIR');
    const logsDir = this.configService.get<string>('LOG_DIR');
    const logSubdirs = this.configService
      .get<string>('LOG_SUB_DIRECTORIES')
      .split('|');
    // Iterate over the directory names and create them if they don't exist
    logSubdirs.forEach((dirName) => {
      const dirPath = join(baseDir, logsDir, dirName);
      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
        this.logger.log(`Created directory: ${dirPath}`);
      }
    });
  }
}
