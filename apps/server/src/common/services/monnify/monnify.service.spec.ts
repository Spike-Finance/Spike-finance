import { Test, TestingModule } from '@nestjs/testing';
import { MonnifyService } from './monnify.service';
import { ConfigService } from '@nestjs/config';
import { HttpClient } from '@nestjs/http-client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('MonnifyService', () => {
  let service: MonnifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonnifyService,
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('test-value') },
        },
        {
          provide: HttpClient,
          useValue: { post: jest.fn(), get: jest.fn() },
        },
        {
          provide: CACHE_MANAGER,
          useValue: { get: jest.fn(), set: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<MonnifyService>(MonnifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
