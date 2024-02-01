import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [AuthModule, UsersModule, AdminModule, MediaModule],
})
export class ApiModule {}
