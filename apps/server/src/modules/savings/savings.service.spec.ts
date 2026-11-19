import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../common/services/prisma/prisma.service';
import { SavingsService } from './savings.service';

describe('SavingsService', () => {
  let service: SavingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SavingsService,
        {
          provide: PrismaService,
          useValue: {
            pocket: { findMany: jest.fn() },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SavingsService>(SavingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should reject savings lock with duration shorter than 7 days', async () => {
    await expect(
      service.createSavingsLock('user-1', {
        name: 'Quick Lock',
        amount: 5000,
        lockDays: 3,
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
