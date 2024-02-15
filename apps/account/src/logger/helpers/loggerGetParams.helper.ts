import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggerGetParams {
  private BASE_DIR;
  private LOGS_DIR;
  private LOGS_MAXSIZE;
  private LOGS_MAXFILES;
  private LOGS_LEVEL;
  constructor(private readonly configService: ConfigService) {
    this.BASE_DIR = this.configService.get<string>('APP_BASE_DIR');
    this.LOGS_DIR = this.configService.get<string>('LOG_DIR');
    this.LOGS_MAXSIZE = Number(this.configService.get<string>('LOG_MAXSIZE'));
    this.LOGS_MAXFILES = Number(this.configService.get<string>('LOG_MAXFILES'));
    this.LOGS_LEVEL = this.configService.get<string>('DEFAULT_LOG_LEVEL');
  }

  public getConfigParams(): any {
    return {
      BASE_DIR: this.BASE_DIR,
      LOGS_DIR: this.LOGS_DIR,
      LOGS_MAXSIZE: this.LOGS_MAXSIZE,
      LOGS_MAXFILES: this.LOGS_MAXFILES,
      LOGS_LEVEL: this.LOGS_LEVEL,
    };
  }
}
