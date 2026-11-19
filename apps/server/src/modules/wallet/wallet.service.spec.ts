import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../common/services/prisma/prisma.service';
import { TransferService } from '../transfer/transfer.service';
import { WalletService } from './wallet.service';

describe('WalletService', () => {
  let service: WalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        { provide: PrismaService, useValue: { pocket: { findFirst: jest.fn() } } },
        { provide: TransferService, useValue: { transferToWallet: jest.fn() } },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
