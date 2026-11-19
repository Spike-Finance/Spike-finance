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
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';
import { TransactionPinService } from '../../common/services/transaction-pin/transaction-pin.service';
import { REQUIRE_TRANSACTION_PIN_KEY } from '../../common/services/transaction-pin/transaction-pin.constants';

describe('TransferController', () => {
  let controller: TransferController;
  let transferService: { transferToWallet: jest.Mock };

  beforeEach(async () => {
    transferService = {
      transferToWallet: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransferController],
      providers: [
        { provide: TransferService, useValue: transferService },
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

    controller = module.get<TransferController>(TransferController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should protect transferToWallet with @RequireTransactionPin', () => {
    const reflector = new Reflector();
    const metadata = reflector.get(
      REQUIRE_TRANSACTION_PIN_KEY,
      TransferController.prototype.transferToWallet,
    );
    expect(metadata).toEqual({ action: 'WALLET_TRANSFER' });
  });

  it('should delegate transferToWallet to TransferService', async () => {
    const dto = { recipientIdentifier: 'friend@example.com', amount: 2500 };
    transferService.transferToWallet.mockResolvedValue({
      message: 'Wallet transfer completed successfully',
      amount: 2500,
    });

    const result = await controller.transferToWallet('user-1', dto);
    expect(transferService.transferToWallet).toHaveBeenCalledWith('user-1', dto);
    expect(result.amount).toBe(2500);
  });
});
