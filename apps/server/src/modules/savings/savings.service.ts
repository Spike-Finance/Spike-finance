import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@spike/database';
import * as crypto from 'crypto';
import { PrismaService } from '../../common/services/prisma/prisma.service';
import { CreateSavingsLockDto } from './dto/create-savings-lock.dto';

@Injectable()
export class SavingsService {
  constructor(private readonly prisma: PrismaService) {}

  async listSavingsPockets(userId: string) {
    const pockets = await this.prisma.pocket.findMany({
      where: {
        userId,
        type: { in: ['LOCKED', 'TARGET', 'FLEXIBLE'] },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      pockets: pockets.map((p) => ({
        id: p.id,
        name: p.name,
        type: p.type,
        status: p.status,
        balance: Number(p.balance),
        currency: p.currency,
        lockedUntil: p.lockedUntil,
        createdAt: p.createdAt,
      })),
    };
  }

  /**
   * Locks funds from the user's MAIN pocket into a new LOCKED savings pocket
   * using atomic double-entry ledger accounting.
   */
  async createSavingsLock(userId: string, dto: CreateSavingsLockDto) {
    const amount = Number(dto.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new BadRequestException('Lock amount must be greater than zero');
    }

    if (!Number.isInteger(dto.lockDays) || dto.lockDays < 7) {
      throw new BadRequestException('Lock duration must be at least 7 days');
    }

    const decimalAmount = new Prisma.Decimal(amount.toFixed(4));
    const lockedUntil = new Date(
      Date.now() + dto.lockDays * 24 * 60 * 60 * 1000,
    );
    const reference = `SAV-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const result = await this.prisma.$transaction(async (tx) => {
      const mainPocket = await tx.pocket.findFirst({
        where: { userId, type: 'MAIN', status: 'ACTIVE' },
        include: { ledgerAccount: true },
      });

      if (!mainPocket) {
        throw new NotFoundException('Main wallet not found');
      }

      const mainBalanceBefore = new Prisma.Decimal(mainPocket.balance);
      if (mainBalanceBefore.lt(decimalAmount)) {
        throw new BadRequestException('Insufficient wallet balance');
      }

      const mainBalanceAfter = mainBalanceBefore.sub(decimalAmount);

      await tx.pocket.update({
        where: { id: mainPocket.id },
        data: {
          balance: mainBalanceAfter,
          version: { increment: 1 },
        },
      });

      const lockedPocket = await tx.pocket.create({
        data: {
          userId,
          name: dto.name.trim(),
          type: 'LOCKED',
          status: 'ACTIVE',
          balance: decimalAmount,
          currency: mainPocket.currency,
          lockedUntil,
        },
      });

      const mainLedger =
        mainPocket.ledgerAccount ??
        (await tx.ledgerAccount.create({
          data: {
            type: 'USER_POCKET',
            name: `User Pocket ${mainPocket.id}`,
            currency: mainPocket.currency,
            pocketId: mainPocket.id,
          },
        }));

      const lockedLedger = await tx.ledgerAccount.create({
        data: {
          type: 'USER_POCKET',
          name: `Locked Savings ${lockedPocket.id}`,
          currency: lockedPocket.currency,
          pocketId: lockedPocket.id,
        },
      });

      const transaction = await tx.transaction.create({
        data: {
          senderId: userId,
          amount: decimalAmount,
          currency: mainPocket.currency,
          reference,
          description: `Savings lock: ${lockedPocket.name}`,
          status: 'SUCCESS',
          type: 'SAVINGS',
          entries: {
            create: [
              {
                accountId: mainLedger.id,
                direction: 'DEBIT',
                amount: decimalAmount,
                balanceBefore: mainBalanceBefore,
                balanceAfter: mainBalanceAfter,
              },
              {
                accountId: lockedLedger.id,
                direction: 'CREDIT',
                amount: decimalAmount,
                balanceBefore: new Prisma.Decimal(0),
                balanceAfter: decimalAmount,
              },
            ],
          },
        },
      });

      return { lockedPocket, transaction, mainBalanceAfter };
    });

    return {
      message: 'Savings lock created successfully',
      reference: result.transaction.reference,
      transactionId: result.transaction.id,
      pocket: {
        id: result.lockedPocket.id,
        name: result.lockedPocket.name,
        type: result.lockedPocket.type,
        balance: Number(result.lockedPocket.balance),
        currency: result.lockedPocket.currency,
        lockedUntil: result.lockedPocket.lockedUntil,
      },
      mainBalanceAfter: Number(result.mainBalanceAfter),
    };
  }

  /**
   * Withdraws a matured locked savings pocket back into the user's MAIN wallet.
   */
  async withdrawSavingsLock(userId: string, pocketId: string) {
    const reference = `SAVW-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const result = await this.prisma.$transaction(async (tx) => {
      const lockedPocket = await tx.pocket.findFirst({
        where: { id: pocketId, userId, type: 'LOCKED' },
        include: { ledgerAccount: true },
      });

      if (!lockedPocket) {
        throw new NotFoundException('Locked savings pocket not found');
      }

      if (lockedPocket.status !== 'ACTIVE') {
        throw new BadRequestException('Savings lock is not active');
      }

      if (lockedPocket.lockedUntil && lockedPocket.lockedUntil > new Date()) {
        throw new BadRequestException(
          `Savings lock has not matured yet (matures on ${lockedPocket.lockedUntil.toISOString()})`,
        );
      }

      const amount = new Prisma.Decimal(lockedPocket.balance);
      if (amount.lte(0)) {
        throw new BadRequestException('Locked savings pocket has zero balance');
      }

      const mainPocket = await tx.pocket.findFirst({
        where: { userId, type: 'MAIN', status: 'ACTIVE' },
        include: { ledgerAccount: true },
      });

      if (!mainPocket) {
        throw new NotFoundException('Main wallet not found');
      }

      const mainBalanceBefore = new Prisma.Decimal(mainPocket.balance);
      const mainBalanceAfter = mainBalanceBefore.add(amount);

      await tx.pocket.update({
        where: { id: lockedPocket.id },
        data: {
          balance: new Prisma.Decimal(0),
          status: 'CLOSED',
          isActive: false,
          version: { increment: 1 },
        },
      });

      await tx.pocket.update({
        where: { id: mainPocket.id },
        data: {
          balance: mainBalanceAfter,
          version: { increment: 1 },
        },
      });

      const lockedLedger =
        lockedPocket.ledgerAccount ??
        (await tx.ledgerAccount.create({
          data: {
            type: 'USER_POCKET',
            name: `Locked Savings ${lockedPocket.id}`,
            currency: lockedPocket.currency,
            pocketId: lockedPocket.id,
          },
        }));

      const mainLedger =
        mainPocket.ledgerAccount ??
        (await tx.ledgerAccount.create({
          data: {
            type: 'USER_POCKET',
            name: `User Pocket ${mainPocket.id}`,
            currency: mainPocket.currency,
            pocketId: mainPocket.id,
          },
        }));

      const transaction = await tx.transaction.create({
        data: {
          senderId: userId,
          amount,
          currency: lockedPocket.currency,
          reference,
          description: `Savings lock maturity withdrawal: ${lockedPocket.name}`,
          status: 'SUCCESS',
          type: 'WITHDRAWAL',
          entries: {
            create: [
              {
                accountId: lockedLedger.id,
                direction: 'DEBIT',
                amount,
                balanceBefore: amount,
                balanceAfter: new Prisma.Decimal(0),
              },
              {
                accountId: mainLedger.id,
                direction: 'CREDIT',
                amount,
                balanceBefore: mainBalanceBefore,
                balanceAfter: mainBalanceAfter,
              },
            ],
          },
        },
      });

      return { transaction, amount, mainBalanceAfter };
    });

    return {
      message: 'Savings lock withdrawn successfully',
      reference: result.transaction.reference,
      transactionId: result.transaction.id,
      amount: Number(result.amount),
      mainBalanceAfter: Number(result.mainBalanceAfter),
    };
  }
}
