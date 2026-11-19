import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../common/services/prisma/prisma.service';
import { BillsService } from './bills.service';

describe('BillsService', () => {
  let service: BillsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillsService,
        {
          provide: PrismaService,
          useValue: {
            transaction: { findMany: jest.fn() },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BillsService>(BillsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should reject bill payment with non-positive amount', async () => {
    await expect(
      service.payBill('user-1', {
        category: 'AIRTIME',
        provider: 'MTN',
        customerReference: '08012345678',
        amount: 0,
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
