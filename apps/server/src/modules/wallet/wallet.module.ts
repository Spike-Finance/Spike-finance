import { Module } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma/prisma.service';
import { TransferModule } from '../transfer/transfer.module';
import { UserAuthModule } from '../user-auth/user-auth.module';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
  imports: [UserAuthModule, TransferModule],
  providers: [WalletService, PrismaService],
  controllers: [WalletController],
  exports: [WalletService],
})
export class WalletModule {}
