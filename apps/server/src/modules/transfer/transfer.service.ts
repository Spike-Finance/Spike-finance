import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@spike/database';
import * as crypto from 'crypto';
import { PrismaService } from '../../common/services/prisma/prisma.service';
import { WalletTransferDto } from './dto/wallet-transfer.dto';

@Injectable()
export class TransferService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Transfers funds from the authenticated user's MAIN wallet pocket to another
   * user's MAIN wallet pocket using atomic double-entry ledger accounting.
   */
  async transferToWallet(senderId: string, dto: WalletTransferDto) {
    const amount = Number(dto.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new BadRequestException('Transfer amount must be greater than zero');
    }

    const identifier = dto.recipientIdentifier.trim();
    const normalizedTag = identifier.startsWith('@')
      ? identifier.slice(1)
      : identifier;

    const recipient = await this.prisma.user.findFirst({
      where: {
        isDeleted: false,
        OR: [
          { id: identifier },
          { email: identifier.toLowerCase() },
          { phone: identifier },
          { tag: { tag: normalizedTag } },
        ],
      },
      select: { id: true, firstName: true, lastName: true, email: true },
    });

    if (!recipient) {
      throw new NotFoundException('Recipient account not found');
    }

    if (recipient.id === senderId) {
      throw new BadRequestException('You cannot transfer funds to yourself');
    }

    const decimalAmount = new Prisma.Decimal(amount.toFixed(4));
    const reference = `TRF-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const result = await this.prisma.$transaction(async (tx) => {
      const senderPocket = await tx.pocket.findFirst({
        where: { userId: senderId, type: 'MAIN', status: 'ACTIVE' },
        include: { ledgerAccount: true },
      });

      if (!senderPocket) {
        throw new NotFoundException('Sender main wallet not found');
      }

      if (new Prisma.Decimal(senderPocket.balance).lt(decimalAmount)) {
        throw new BadRequestException('Insufficient wallet balance');
      }

      const recipientPocket = await tx.pocket.findFirst({
        where: { userId: recipient.id, type: 'MAIN', status: 'ACTIVE' },
        include: { ledgerAccount: true },
      });

      if (!recipientPocket) {
        throw new NotFoundException('Recipient main wallet not found');
      }

      const senderLedger =
        senderPocket.ledgerAccount ??
        (await tx.ledgerAccount.create({
          data: {
            type: 'USER_POCKET',
            name: `User Pocket ${senderPocket.id}`,
            currency: senderPocket.currency,
            pocketId: senderPocket.id,
          },
        }));

      const recipientLedger =
        recipientPocket.ledgerAccount ??
        (await tx.ledgerAccount.create({
          data: {
            type: 'USER_POCKET',
            name: `User Pocket ${recipientPocket.id}`,
            currency: recipientPocket.currency,
            pocketId: recipientPocket.id,
          },
        }));

      const senderBalanceBefore = new Prisma.Decimal(senderPocket.balance);
      const senderBalanceAfter = senderBalanceBefore.sub(decimalAmount);
      const recipientBalanceBefore = new Prisma.Decimal(recipientPocket.balance);
      const recipientBalanceAfter = recipientBalanceBefore.add(decimalAmount);

      await tx.pocket.update({
        where: { id: senderPocket.id },
        data: {
          balance: senderBalanceAfter,
          version: { increment: 1 },
        },
      });

      await tx.pocket.update({
        where: { id: recipientPocket.id },
        data: {
          balance: recipientBalanceAfter,
          version: { increment: 1 },
        },
      });

      const transaction = await tx.transaction.create({
        data: {
          senderId,
          amount: decimalAmount,
          currency: senderPocket.currency,
          reference,
          description: dto.description?.trim() || 'Wallet transfer',
          status: 'SUCCESS',
          type: 'TRANSFER',
          entries: {
            create: [
              {
                accountId: senderLedger.id,
                direction: 'DEBIT',
                amount: decimalAmount,
                balanceBefore: senderBalanceBefore,
                balanceAfter: senderBalanceAfter,
              },
              {
                accountId: recipientLedger.id,
                direction: 'CREDIT',
                amount: decimalAmount,
                balanceBefore: recipientBalanceBefore,
                balanceAfter: recipientBalanceAfter,
              },
            ],
          },
        },
      });

      return {
        transaction,
        senderBalanceAfter,
      };
    });

    return {
      message: 'Wallet transfer completed successfully',
      reference: result.transaction.reference,
      transactionId: result.transaction.id,
      amount: Number(result.transaction.amount),
      currency: result.transaction.currency,
      balanceAfter: Number(result.senderBalanceAfter),
    };
  }
}
