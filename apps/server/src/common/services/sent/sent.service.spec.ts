import { Test, TestingModule } from '@nestjs/testing';
import { SentService } from './sent.service';
import { ConfigService } from '@nestjs/config';
import { HttpClient } from '@nestjs/http-client';

describe('SentService', () => {
  let service: SentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SentService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue('mock-sent-api-key'),
            get: jest.fn().mockReturnValue('mock-value'),
          },
        },
        {
          provide: HttpClient,
          useValue: {
            post: jest.fn().mockResolvedValue({ data: { success: true } }),
          },
        },
      ],
    }).compile();

    service = module.get<SentService>(SentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
