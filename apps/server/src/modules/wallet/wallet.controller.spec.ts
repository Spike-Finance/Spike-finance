jest.mock('@nestjs/swagger', () => ({
  ApiTags: () => () => {},
  ApiOperation: () => () => {},
  ApiResponse: () => () => {},
  ApiBearerAuth: () => () => {},
  ApiHeader: () => () => {},
  ApiProperty: () => () => {},
  ApiPropertyOptional: () => () => {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { TransactionPinService } from '../../common/services/transaction-pin/transaction-pin.service';
import { REQUIRE_TRANSACTION_PIN_KEY } from '../../common/services/transaction-pin/transaction-pin.constants';

describe('WalletController', () => {
  let controller: WalletController;
  let walletService: { getWalletBalance: jest.Mock; transfer: jest.Mock };

  beforeEach(async () => {
    walletService = {
      getWalletBalance: jest.fn(),
      transfer: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletController],
      providers: [
        { provide: WalletService, useValue: walletService },
        { provide: JwtService, useValue: { verifyAsync: jest.fn() } },
        {
          provide: ConfigService,
          useValue: { getOrThrow: jest.fn().mockReturnValue('secret') },
        },
        {
          provide: TransactionPinService,
          useValue: { verifyPin: jest.fn(), recordAuditEvent: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<WalletController>(WalletController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should protect wallet transfer endpoint with @RequireTransactionPin', () => {
    const reflector = new Reflector();
    const metadata = reflector.get(
      REQUIRE_TRANSACTION_PIN_KEY,
      WalletController.prototype.transfer,
    );
    expect(metadata).toEqual({ action: 'WALLET_TRANSFER' });
  });

  it('should not require transaction PIN on read-only getBalance endpoint', () => {
    const reflector = new Reflector();
    const metadata = reflector.get(
      REQUIRE_TRANSACTION_PIN_KEY,
      WalletController.prototype.getBalance,
    );
    expect(metadata).toBeUndefined();
  });
});
