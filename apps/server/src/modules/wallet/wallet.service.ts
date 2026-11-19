import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma/prisma.service';
import { TransferService } from '../transfer/transfer.service';
import { WalletTransferDto } from '../transfer/dto/wallet-transfer.dto';

@Injectable()
export class WalletService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly transferService: TransferService,
  ) {}

  async getWalletBalance(userId: string) {
    const pocket = await this.prisma.pocket.findFirst({
      where: { userId, type: 'MAIN', status: 'ACTIVE' },
    });

    if (!pocket) {
      throw new NotFoundException('Main wallet not found');
    }

    return {
      pocketId: pocket.id,
      name: pocket.name,
      balance: Number(pocket.balance),
      currency: pocket.currency,
      status: pocket.status,
    };
  }

  async transfer(userId: string, dto: WalletTransferDto) {
    return this.transferService.transferToWallet(userId, dto);
  }
}
