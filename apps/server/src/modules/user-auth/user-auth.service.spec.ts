import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserAuthService } from './user-auth.service';
import { PrismaService } from '../../common/services/prisma/prisma.service';
import { EmailService } from '../../common/services/email/email.service';
import { SentService } from '../../common/services/sent/sent.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DeviceType } from '@spike/database';
import * as bcrypt from 'bcryptjs';

describe('UserAuthService', () => {
  let service: UserAuthService;
  let prismaService: {
    user: {
      findFirst: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    pocket: { create: jest.Mock };
    otp: {
      create: jest.Mock;
      updateMany: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
    };
    virtualAccount: { create: jest.Mock; findFirst: jest.Mock };
    userDevice: { upsert: jest.Mock };
  };

  beforeEach(async () => {
    prismaService = {
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
        findFirst: jest.fn(),
      },
      userDevice: {
        upsert: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserAuthService,
        {
          provide: PrismaService,
          useValue: prismaService,
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

  describe('resendOtp', () => {
    it('should successfully resend OTP when user exists', async () => {
      prismaService.user.findFirst.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
      });
      prismaService.otp.updateMany.mockResolvedValue({ count: 1 });
      prismaService.otp.create.mockResolvedValue({ id: 'otp-123' });

      const result = await service.resendOtp({
        payload: { email: 'test@example.com' },
      });

      expect(result.message).toContain('Verification code resent');
      expect(result.target).toBe('test@example.com');
      expect(result.method).toBe('EMAIL');
      expect(prismaService.otp.updateMany).toHaveBeenCalledWith({
        where: { target: 'test@example.com', isUsed: false },
        data: { isUsed: true },
      });
      expect(prismaService.otp.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user does not exist', async () => {
      prismaService.user.findFirst.mockResolvedValue(null);

      await expect(
        service.resendOtp({
          payload: { email: 'nonexistent@example.com' },
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('createPin', () => {
    it('should create and hash a 4-digit PIN for user', async () => {
      prismaService.user.findUnique.mockResolvedValue({
        id: 'user-123',
        transactionPin: null,
      });
      prismaService.user.update.mockResolvedValue({ id: 'user-123' });

      const result = await service.createPin('user-123', { pin: '1234' });

      expect(result.message).toBe('Transaction PIN created successfully');
      expect(result.hasPin).toBe(true);
      expect(prismaService.user.update).toHaveBeenCalled();
    });

    it('should throw BadRequestException if PIN already exists', async () => {
      prismaService.user.findUnique.mockResolvedValue({
        id: 'user-123',
        transactionPin: 'already-set-hash',
      });

      await expect(
        service.createPin('user-123', { pin: '1234' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('verifyPin', () => {
    it('should verify matching PIN successfully', async () => {
      const hashed = await bcrypt.hash('1234', 10);
      prismaService.user.findUnique.mockResolvedValue({
        id: 'user-123',
        transactionPin: hashed,
      });

      const result = await service.verifyPin('user-123', { pin: '1234' });
      expect(result.valid).toBe(true);
      expect(result.message).toBe('Transaction PIN verified successfully');
    });

    it('should throw BadRequestException on incorrect PIN', async () => {
      const hashed = await bcrypt.hash('1234', 10);
      prismaService.user.findUnique.mockResolvedValue({
        id: 'user-123',
        transactionPin: hashed,
      });

      await expect(
        service.verifyPin('user-123', { pin: '9999' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('changePin', () => {
    it('should change PIN when old PIN matches', async () => {
      const hashedOld = await bcrypt.hash('1234', 10);
      prismaService.user.findUnique.mockResolvedValue({
        id: 'user-123',
        transactionPin: hashedOld,
      });
      prismaService.user.update.mockResolvedValue({ id: 'user-123' });

      const result = await service.changePin('user-123', {
        oldPin: '1234',
        newPin: '5678',
      });

      expect(result.message).toBe('Transaction PIN changed successfully');
      expect(prismaService.user.update).toHaveBeenCalled();
    });

    it('should throw BadRequestException if old PIN is incorrect', async () => {
      const hashedOld = await bcrypt.hash('1234', 10);
      prismaService.user.findUnique.mockResolvedValue({
        id: 'user-123',
        transactionPin: hashedOld,
      });

      await expect(
        service.changePin('user-123', {
          oldPin: '0000',
          newPin: '5678',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if new PIN is identical to old PIN', async () => {
      const hashedOld = await bcrypt.hash('1234', 10);
      prismaService.user.findUnique.mockResolvedValue({
        id: 'user-123',
        transactionPin: hashedOld,
      });

      await expect(
        service.changePin('user-123', {
          oldPin: '1234',
          newPin: '1234',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('registerPushToken', () => {
    it('should register push token for user', async () => {
      prismaService.user.findUnique.mockResolvedValue({ id: 'user-123' });
      prismaService.user.update.mockResolvedValue({
        id: 'user-123',
        pushToken: 'push-token-abc',
      });

      const result = await service.registerPushToken('user-123', {
        pushToken: 'push-token-abc',
      });

      expect(result.message).toBe('Push token registered successfully');
      expect(result.pushToken).toBe('push-token-abc');
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: { pushToken: 'push-token-abc' },
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.registerPushToken('user-404', { pushToken: 'token' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('registerDevice', () => {
    it('should register/upsert current device with ip and location', async () => {
      prismaService.user.findUnique.mockResolvedValue({ id: 'user-123' });
      prismaService.userDevice.upsert.mockResolvedValue({
        id: 'device-1',
        userId: 'user-123',
        deviceId: 'device-uuid-1',
        deviceType: DeviceType.IOS,
        ip: '192.168.1.1',
        location: 'Lagos, Nigeria',
        name: 'iPhone 15 Pro',
      });

      const result = await service.registerDevice(
        'user-123',
        {
          deviceId: 'device-uuid-1',
          deviceType: DeviceType.IOS,
          name: 'iPhone 15 Pro',
          location: 'Lagos, Nigeria',
        },
        '192.168.1.1',
      );

      expect(result.message).toBe('Device registered successfully');
      expect(result.device.deviceId).toBe('device-uuid-1');
      expect(prismaService.userDevice.upsert).toHaveBeenCalledWith({
        where: {
          userId_deviceId: {
            userId: 'user-123',
            deviceId: 'device-uuid-1',
          },
        },
        create: {
          userId: 'user-123',
          deviceId: 'device-uuid-1',
          name: 'iPhone 15 Pro',
          deviceType: DeviceType.IOS,
          ip: '192.168.1.1',
          location: 'Lagos, Nigeria',
        },
        update: {
          name: 'iPhone 15 Pro',
          deviceType: DeviceType.IOS,
          ip: '192.168.1.1',
          location: 'Lagos, Nigeria',
          isDeleted: false,
          deletedAt: null,
        },
      });
    });

    it('should throw NotFoundException if user is not found when registering device', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.registerDevice('user-404', {
          deviceId: 'device-uuid-1',
          deviceType: DeviceType.ANDROID,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
