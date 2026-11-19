import { Module } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma/prisma.service';
import { UserAuthModule } from '../user-auth/user-auth.module';
import { BillsController } from './bills.controller';
import { BillsService } from './bills.service';

@Module({
  imports: [UserAuthModule],
  providers: [BillsService, PrismaService],
  controllers: [BillsController],
  exports: [BillsService],
})
export class BillsModule {}
