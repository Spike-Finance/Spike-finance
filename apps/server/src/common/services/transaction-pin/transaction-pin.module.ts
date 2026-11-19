import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionPinService } from './transaction-pin.service';
import { TransactionPinGuard } from '../../guards/transaction-pin.guard';

@Global()
@Module({
  providers: [PrismaService, TransactionPinService, TransactionPinGuard],
  exports: [TransactionPinService, TransactionPinGuard],
})
export class TransactionPinModule {}
