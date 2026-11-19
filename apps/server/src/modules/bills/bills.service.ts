import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@spike/database';
import * as crypto from 'crypto';
import { PrismaService } from '../../common/services/prisma/prisma.service';
import { PayBillDto } from './dto/pay-bill.dto';

@Injectable()
export class BillsService {
  constructor(private readonly prisma: PrismaService) {}

  async getBillHistory(userId: string) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        senderId: userId,
        type: 'BILLS',
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return {
      bills: transactions.map((t) => ({
        id: t.id,
        reference: t.reference,
        provider: t.provider,
        amount: Number(t.amount),
        currency: t.currency,
        description: t.description,
        status: t.status,
        createdAt: t.createdAt,
      })),
    };
  }

  /**
   * Pays a utility/telecom bill by atomically debiting the user's MAIN wallet
   * and crediting the system BILLS ledger account.
   */
  async payBill(userId: string, dto: PayBillDto) {
    const amount = Number(dto.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new BadRequestException('Bill amount must be greater than zero');
    }

    const decimalAmount = new Prisma.Decimal(amount.toFixed(4));
    const reference = `BILL-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const provider = dto.provider.trim().toUpperCase();
    const customerReference = dto.customerReference.trim();

    const result = await this.prisma.$transaction(async (tx) => {
      const mainPocket = await tx.pocket.findFirst({
        where: { userId, type: 'MAIN', status: 'ACTIVE' },
        include: { ledgerAccount: true },
      });

      if (!mainPocket) {
        throw new NotFoundException('Main wallet not found');
      }

      const balanceBefore = new Prisma.Decimal(mainPocket.balance);
      if (balanceBefore.lt(decimalAmount)) {
        throw new BadRequestException('Insufficient wallet balance');
      }

      const balanceAfter = balanceBefore.sub(decimalAmount);

      await tx.pocket.update({
        where: { id: mainPocket.id },
        data: {
          balance: balanceAfter,
          version: { increment: 1 },
        },
      });

      const userLedger =
        mainPocket.ledgerAccount ??
        (await tx.ledgerAccount.create({
          data: {
            type: 'USER_POCKET',
            name: `User Pocket ${mainPocket.id}`,
            currency: mainPocket.currency,
            pocketId: mainPocket.id,
          },
        }));

      let billsLedger = await tx.ledgerAccount.findFirst({
        where: { type: 'BILLS', currency: mainPocket.currency },
      });

      if (!billsLedger) {
        billsLedger = await tx.ledgerAccount.create({
          data: {
            type: 'BILLS',
            name: `Bills Settlement (${mainPocket.currency})`,
            currency: mainPocket.currency,
          },
        });
      }

      const transaction = await tx.transaction.create({
        data: {
          senderId: userId,
          amount: decimalAmount,
          currency: mainPocket.currency,
          reference,
          provider,
          description:
            dto.description?.trim() ||
            `${dto.category} bill payment (${provider} - ${customerReference})`,
          status: 'SUCCESS',
          type: 'BILLS',
          entries: {
            create: [
              {
                accountId: userLedger.id,
                direction: 'DEBIT',
                amount: decimalAmount,
                balanceBefore,
                balanceAfter,
              },
              {
                accountId: billsLedger.id,
                direction: 'CREDIT',
                amount: decimalAmount,
              },
            ],
          },
        },
      });

      return { transaction, balanceAfter };
    });

    return {
      message: 'Bill payment completed successfully',
      reference: result.transaction.reference,
      transactionId: result.transaction.id,
      category: dto.category,
      provider,
      customerReference,
      amount: Number(result.transaction.amount),
      currency: result.transaction.currency,
      balanceAfter: Number(result.balanceAfter),
    };
  }
}
