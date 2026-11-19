import {
  BadRequestException,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TransactionPinGuard } from './transaction-pin.guard';
import { TransactionPinService } from '../services/transaction-pin/transaction-pin.service';
import { PinAuditAction } from '../services/transaction-pin/transaction-pin.constants';

describe('TransactionPinGuard', () => {
  let guard: TransactionPinGuard;
  let reflector: { getAllAndOverride: jest.Mock };
  let transactionPinService: {
    verifyPin: jest.Mock;
    recordAuditEvent: jest.Mock;
  };

  const createContext = (req: Record<string, unknown>): ExecutionContext =>
    ({
      getHandler: () => () => {},
      getClass: () => class TestController {},
      switchToHttp: () => ({
        getRequest: () => req,
      }),
    }) as unknown as ExecutionContext;

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() };
    transactionPinService = {
      verifyPin: jest
        .fn()
        .mockResolvedValue({ valid: true, message: 'PIN verified' }),
      recordAuditEvent: jest.fn().mockResolvedValue(undefined),
    };
    guard = new TransactionPinGuard(
      reflector as unknown as Reflector,
      transactionPinService as unknown as TransactionPinService,
    );
  });

  it('should allow request when @RequireTransactionPin is not set', async () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    const ctx = createContext({});

    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    expect(transactionPinService.verifyPin).not.toHaveBeenCalled();
  });

  it('should reject unauthenticated requests when @RequireTransactionPin is set', async () => {
    reflector.getAllAndOverride.mockReturnValue({ action: 'WALLET_TRANSFER' });
    const ctx = createContext({ headers: {}, body: {} });

    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
  });

  it('should reject and record PIN_AUTH_FAILED when PIN is missing from header and body', async () => {
    reflector.getAllAndOverride.mockReturnValue({ action: 'WALLET_TRANSFER' });
    const ctx = createContext({
      user: { sub: 'user-1', sessionId: 'sess-1', deviceId: 'dev-1' },
      headers: { 'user-agent': 'Jest' },
      body: { amount: 5000 },
      method: 'POST',
      originalUrl: '/api/transfer/wallet',
      ip: '127.0.0.1',
    });

    await expect(guard.canActivate(ctx)).rejects.toThrow(BadRequestException);
    expect(transactionPinService.recordAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        action: PinAuditAction.PIN_AUTH_FAILED,
        metadata: expect.objectContaining({
          reason: 'PIN_MISSING',
          operation: 'WALLET_TRANSFER',
        }),
      }),
    );
  });

  it('should verify PIN from x-transaction-pin header and mark request.pinVerified', async () => {
    reflector.getAllAndOverride.mockReturnValue({ action: 'BILL_PAYMENT' });
    const req: Record<string, unknown> = {
      user: { sub: 'user-1', sessionId: 'sess-1', deviceId: 'dev-1' },
      headers: { 'x-transaction-pin': '1234', 'user-agent': 'SpikeApp/1.0' },
      body: { amount: 1500 },
      method: 'POST',
      originalUrl: '/api/bills/pay',
      ip: '10.0.0.5',
    };

    await expect(guard.canActivate(createContext(req))).resolves.toBe(true);
    expect(transactionPinService.verifyPin).toHaveBeenCalledWith(
      'user-1',
      '1234',
      expect.objectContaining({
        action: 'BILL_PAYMENT',
        endpoint: 'POST /api/bills/pay',
        ip: '10.0.0.5',
        deviceId: 'dev-1',
        sessionId: 'sess-1',
      }),
    );
    expect(req.pinVerified).toBe(true);
  });

  it('should verify PIN from request body transactionPin field', async () => {
    reflector.getAllAndOverride.mockReturnValue({ action: 'SAVINGS_LOCK' });
    const req: Record<string, unknown> = {
      user: { sub: 'user-2' },
      headers: {},
      body: { name: 'Rent', amount: 10000, lockDays: 30, transactionPin: '4321' },
      method: 'POST',
      url: '/savings/lock',
      ip: '10.0.0.9',
    };

    await expect(guard.canActivate(createContext(req))).resolves.toBe(true);
    expect(transactionPinService.verifyPin).toHaveBeenCalledWith(
      'user-2',
      '4321',
      expect.objectContaining({
        action: 'SAVINGS_LOCK',
      }),
    );
  });
});
