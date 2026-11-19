import { Module } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma/prisma.service';
import { UserAuthModule } from '../user-auth/user-auth.module';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';

@Module({
  imports: [UserAuthModule],
  controllers: [TransferController],
  providers: [TransferService, PrismaService],
  exports: [TransferService],
})
export class TransferModule {}
