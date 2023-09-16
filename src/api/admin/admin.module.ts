import { Module, UseFilters } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/entities/user.entity';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { LoggerService } from 'src/common/logger/logger.service';
import {
  AllExceptionsFilter,
  HttpExceptionFilter,
  TypeORMExceptionFilter,
} from 'src/common/exception-filters';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule, UsersModule],
  controllers: [AdminController],
  providers: [
    {
      provide: LoggerService,
      useFactory: () => {
        return new LoggerService('admin');
      },
    },
  ],
})
export class AdminModule {}
