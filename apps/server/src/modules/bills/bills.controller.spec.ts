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
import { BillsController } from './bills.controller';
import { BillsService } from './bills.service';
import { TransactionPinService } from '../../common/services/transaction-pin/transaction-pin.service';
import { REQUIRE_TRANSACTION_PIN_KEY } from '../../common/services/transaction-pin/transaction-pin.constants';

describe('BillsController', () => {
  let controller: BillsController;
  let billsService: { getBillHistory: jest.Mock; payBill: jest.Mock };

  beforeEach(async () => {
    billsService = {
      getBillHistory: jest.fn(),
      payBill: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillsController],
      providers: [
        { provide: BillsService, useValue: billsService },
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

    controller = module.get<BillsController>(BillsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should protect payBill with @RequireTransactionPin', () => {
    const reflector = new Reflector();
    expect(
      reflector.get(
        REQUIRE_TRANSACTION_PIN_KEY,
        BillsController.prototype.payBill,
      ),
    ).toEqual({ action: 'BILL_PAYMENT' });

    expect(
      reflector.get(
        REQUIRE_TRANSACTION_PIN_KEY,
        BillsController.prototype.getBillHistory,
      ),
    ).toBeUndefined();
  });
});
