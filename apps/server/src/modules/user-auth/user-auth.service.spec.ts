import { Test, TestingModule } from '@nestjs/testing';
import { UserAuthService } from './user-auth.service';
import { PrismaService } from '../../common/services/prisma/prisma.service';
import { EmailService } from '../../common/services/email/email.service';
import { SentService } from '../../common/services/sent/sent.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('UserAuthService', () => {
  let service: UserAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserAuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findFirst: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            pocket: {
              create: jest.fn(),
            },
            otp: {
              create: jest.fn(),
              updateMany: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
            },
            virtualAccount: {
              create: jest.fn(),
            },
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendOtpEmail: jest.fn().mockResolvedValue({ id: 'mock-id' }),
          },
        },
        {
          provide: SentService,
          useValue: {
            sendMessage: jest.fn().mockResolvedValue({ success: true }),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mock-jwt-token'),
            verifyAsync: jest
              .fn()
              .mockResolvedValue({ sub: 'user-id', tokenType: 'refresh' }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue('mock-jwt-secret'),
          },
        },
      ],
    }).compile();

    service = module.get<UserAuthService>(UserAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
