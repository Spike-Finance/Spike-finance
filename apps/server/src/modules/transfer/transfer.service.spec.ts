import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../common/services/prisma/prisma.service';
import { TransferService } from './transfer.service';

describe('TransferService', () => {
  let service: TransferService;
  let prisma: {
    user: { findFirst: jest.Mock };
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      user: { findFirst: jest.fn() },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransferService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<TransferService>(TransferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should reject self transfers', async () => {
    prisma.user.findFirst.mockResolvedValue({ id: 'user-1' });

    await expect(
      service.transferToWallet('user-1', {
        recipientIdentifier: 'user-1',
        amount: 1000,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException if recipient does not exist', async () => {
    prisma.user.findFirst.mockResolvedValue(null);

    await expect(
      service.transferToWallet('user-1', {
        recipientIdentifier: 'missing@example.com',
        amount: 1000,
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
