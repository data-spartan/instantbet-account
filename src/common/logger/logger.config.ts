import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { transports, createLogger, format, LoggerOptions } from 'winston';

export class LoggerConfig {
  private options: LoggerOptions;
  private dir;
  private context;
  private level;
  private logsSize;
  private logsMaxFiles;

  constructor(
    baseDir: string,
    logsDir: string,
    level: string,
    logsSize: number,
    logsMaxFiles: number,
    context: string,
  ) {
    this.dir = join(baseDir, logsDir);
    this.context = context;
    this.level = level;
  }
  private fileTransportOptions = (context: string) => ({
    format: format.combine(format.timestamp(), format.json()),
    exitOnError: false,
    transports: [
      new transports.File({
        filename: `${context}.log`,
        level: this.level,
        dirname: `${this.dir}/${context}`,
        maxsize: this.logsSize,
        maxFiles: this.logsMaxFiles,
      }),
    ],
  });

  private consoleTransportOptions = () => ({
    format: format.combine(format.timestamp(), format.json()),
    exitOnError: false,
    transports: [
      new transports.Console({
        level: this.level,
      }),
    ],
  });

  public getConfig(): LoggerOptions {
    this.options =
      process.env.NODE_ENV !== 'test'
        ? this.fileTransportOptions(this.context)
        : this.consoleTransportOptions();
    return this.options;
  }
}
