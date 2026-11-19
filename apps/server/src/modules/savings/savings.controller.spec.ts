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
import { SavingsController } from './savings.controller';
import { SavingsService } from './savings.service';
import { TransactionPinService } from '../../common/services/transaction-pin/transaction-pin.service';
import { REQUIRE_TRANSACTION_PIN_KEY } from '../../common/services/transaction-pin/transaction-pin.constants';

describe('SavingsController', () => {
  let controller: SavingsController;
  let savingsService: {
    listSavingsPockets: jest.Mock;
    createSavingsLock: jest.Mock;
    withdrawSavingsLock: jest.Mock;
  };

  beforeEach(async () => {
    savingsService = {
      listSavingsPockets: jest.fn(),
      createSavingsLock: jest.fn(),
      withdrawSavingsLock: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SavingsController],
      providers: [
        { provide: SavingsService, useValue: savingsService },
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

    controller = module.get<SavingsController>(SavingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should protect createSavingsLock and withdrawSavingsLock with @RequireTransactionPin', () => {
    const reflector = new Reflector();
    expect(
      reflector.get(
        REQUIRE_TRANSACTION_PIN_KEY,
        SavingsController.prototype.createSavingsLock,
      ),
    ).toEqual({ action: 'SAVINGS_LOCK' });

    expect(
      reflector.get(
        REQUIRE_TRANSACTION_PIN_KEY,
        SavingsController.prototype.withdrawSavingsLock,
      ),
    ).toEqual({ action: 'SAVINGS_LOCK_WITHDRAWAL' });

    expect(
      reflector.get(
        REQUIRE_TRANSACTION_PIN_KEY,
        SavingsController.prototype.listSavingsPockets,
      ),
    ).toBeUndefined();
  });
});
