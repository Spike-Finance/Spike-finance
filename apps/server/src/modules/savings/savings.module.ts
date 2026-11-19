import { Module } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma/prisma.service';
import { UserAuthModule } from '../user-auth/user-auth.module';
import { SavingsController } from './savings.controller';
import { SavingsService } from './savings.service';

@Module({
  imports: [UserAuthModule],
  controllers: [SavingsController],
  providers: [SavingsService, PrismaService],
  exports: [SavingsService],
})
export class SavingsModule {}
