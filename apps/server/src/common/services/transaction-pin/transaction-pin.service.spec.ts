import { BadRequestException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import {
  PinAuditAction,
  sanitizePinAuditMetadata,
} from './transaction-pin.constants';
import {
  PinLockedException,
  TransactionPinService,
} from './transaction-pin.service';

describe('TransactionPinService', () => {
  let service: TransactionPinService;
  let prisma: {
    user: { findUnique: jest.Mock; update: jest.Mock };
    auditLog: { create: jest.Mock };
  };
  let configValues: Record<string, string | number | undefined>;

  beforeEach(async () => {
    configValues = {};
    prisma = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn().mockResolvedValue({}),
      },
      auditLog: {
        create: jest.fn().mockResolvedValue({ id: 'audit-1' }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionPinService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => configValues[key]),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionPinService>(TransactionPinService);
  });

  it('should verify a valid PIN and reset prior failed attempts', async () => {
    const hashed = await bcrypt.hash('1234', 10);
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      transactionPin: hashed,
      pinFailedAttempts: 2,
      pinLockedUntil: null,
      pinRequiresRecovery: false,
      pinLockoutCount: 0,
      lastPinFailedAt: new Date(Date.now() - 60_000),
    });

    const result = await service.verifyPin('user-1', '1234', {
      action: 'WALLET_TRANSFER',
      ip: '10.0.0.1',
    });

    expect(result).toEqual({
      valid: true,
      message: 'Transaction PIN verified successfully',
    });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: {
        pinFailedAttempts: 0,
        lastPinFailedAt: null,
      },
    });
  });

  it('should increment consecutive failed attempts and record PIN_AUTH_FAILED without logging PIN', async () => {
    const warnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    const logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    const hashed = await bcrypt.hash('1234', 10);

    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      transactionPin: hashed,
      pinFailedAttempts: 1,
      pinLockedUntil: null,
      pinRequiresRecovery: false,
      pinLockoutCount: 0,
      lastPinFailedAt: null,
    });

    const wrongPin = '9876';
    await expect(
      service.verifyPin('user-1', wrongPin, {
        action: 'WALLET_TRANSFER',
        endpoint: 'POST /api/transfer/wallet',
        ip: '192.168.1.5',
      }),
    ).rejects.toThrow(BadRequestException);

    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'user-1' },
        data: expect.objectContaining({
          pinFailedAttempts: 2,
        }),
      }),
    );

    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          actorId: 'user-1',
          action: PinAuditAction.PIN_AUTH_FAILED,
          ip: '192.168.1.5',
        }),
      }),
    );

    // Ensure the actual PIN never appears in AuditLog or Logger calls
    const serializedAudit = JSON.stringify(prisma.auditLog.create.mock.calls);
    const serializedWarnings = JSON.stringify(warnSpy.mock.calls);
    const serializedLogs = JSON.stringify(logSpy.mock.calls);
    expect(serializedAudit).not.toContain(wrongPin);
    expect(serializedWarnings).not.toContain(wrongPin);
    expect(serializedLogs).not.toContain(wrongPin);

    warnSpy.mockRestore();
    logSpy.mockRestore();
  });

  it('should temporarily lock PIN authorization after configured 3-5 consecutive failed attempts', async () => {
    configValues['PIN_MAX_FAILED_ATTEMPTS'] = 3;
    const hashed = await bcrypt.hash('1234', 10);

    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      transactionPin: hashed,
      pinFailedAttempts: 2, // 3rd consecutive failure triggers lockout
      pinLockedUntil: null,
      pinRequiresRecovery: false,
      pinLockoutCount: 0,
      lastPinFailedAt: new Date(Date.now() - 10_000),
    });

    let caughtError: unknown;
    try {
      await service.verifyPin('user-1', '0000', {
        action: 'BILL_PAYMENT',
        ip: '10.0.0.2',
      });
    } catch (error) {
      caughtError = error;
    }

    expect(caughtError).toBeInstanceOf(PinLockedException);
    expect((caughtError as PinLockedException).getStatus()).toBe(
      HttpStatus.LOCKED,
    );

    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'user-1' },
        data: expect.objectContaining({
          pinFailedAttempts: 3,
          pinRequiresRecovery: true,
          pinLockoutCount: 1,
          pinLockedUntil: expect.any(Date),
        }),
      }),
    );

    const loggedActions = prisma.auditLog.create.mock.calls.map(
      (call) => call[0].data.action,
    );
    expect(loggedActions).toContain(PinAuditAction.PIN_AUTH_FAILED);
    expect(loggedActions).toContain(PinAuditAction.PIN_LOCKED);
    expect(loggedActions).toContain(PinAuditAction.PIN_SUSPICIOUS_ACTIVITY);
  });

  it('should reject immediately and record suspicious activity when PIN is already locked', async () => {
    const hashed = await bcrypt.hash('1234', 10);
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      transactionPin: hashed,
      pinFailedAttempts: 5,
      pinLockedUntil: new Date(Date.now() + 10 * 60_000),
      pinRequiresRecovery: true,
      pinLockoutCount: 1,
      lastPinFailedAt: new Date(),
    });

    await expect(
      service.verifyPin('user-1', '1234', {
        action: 'SAVINGS_LOCK',
        ip: '10.0.0.3',
      }),
    ).rejects.toThrow(PinLockedException);

    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: PinAuditAction.PIN_SUSPICIOUS_ACTIVITY,
          metadata: expect.objectContaining({
            reason: 'ATTEMPT_WHILE_LOCKED',
          }),
        }),
      }),
    );
  });

  it('should keep PIN locked until OTP/KYC restoration even after temporary timer expires', async () => {
    const hashed = await bcrypt.hash('1234', 10);
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      transactionPin: hashed,
      pinFailedAttempts: 5,
      pinLockedUntil: new Date(Date.now() - 60_000), // expired timer
      pinRequiresRecovery: true, // still requires OTP/KYC restoration
      pinLockoutCount: 1,
      lastPinFailedAt: new Date(Date.now() - 20 * 60_000),
    });

    await expect(service.verifyPin('user-1', '1234')).rejects.toThrow(
      PinLockedException,
    );
  });

  it('should strip all sensitive keys in sanitizePinAuditMetadata', () => {
    const cleaned = sanitizePinAuditMetadata({
      operation: 'WALLET_TRANSFER',
      pin: '1234',
      transactionPin: '1234',
      otpCode: '654321',
      bvn: '22233344455',
      nested: {
        oldPin: '1111',
        safeField: 'kept',
      },
    });

    expect(cleaned).toEqual({
      operation: 'WALLET_TRANSFER',
      nested: {
        safeField: 'kept',
      },
    });
  });
});
