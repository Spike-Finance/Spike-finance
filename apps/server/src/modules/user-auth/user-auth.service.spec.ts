import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserAuthService } from './user-auth.service';
import { PrismaService } from '../../common/services/prisma/prisma.service';
import { EmailService } from '../../common/services/email/email.service';
import { SentService } from '../../common/services/sent/sent.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DeviceType } from '@spike/database';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

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
    userDevice: {
      upsert: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
      updateMany: jest.Mock;
    };
    userSession: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      updateMany: jest.Mock;
      count: jest.Mock;
    };
    biometricChallenge: {
      create: jest.Mock;
      findUnique: jest.Mock;
      updateMany: jest.Mock;
    };
    auditLog: {
      create: jest.Mock;
    };
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
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
      userSession: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        count: jest.fn(),
      },
      biometricChallenge: {
        create: jest.fn(),
        findUnique: jest.fn(),
        updateMany: jest.fn(),
      },
      auditLog: {
        create: jest.fn().mockResolvedValue({ id: 'audit-1' }),
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

  describe('Session Tracking & Logout', () => {
    it('should retrieve active sessions and tag the current session', async () => {
      const mockSessions = [
        {
          id: 'session-1',
          deviceId: 'device-1',
          device: {
            id: 'd-1',
            deviceId: 'device-1',
            name: 'iPhone 15',
            deviceType: DeviceType.IOS,
            isPrimaryDevice: true,
          },
          ipAddress: '197.210.54.12',
          userAgent: 'Mozilla/5.0 iOS',
          location: 'Lagos, Nigeria',
          isRevoked: false,
          lastActiveAt: new Date(),
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 100000),
        },
        {
          id: 'session-2',
          deviceId: null,
          device: null,
          ipAddress: '197.210.54.13',
          userAgent: 'Mozilla/5.0 Chrome',
          location: 'Abuja, Nigeria',
          isRevoked: false,
          lastActiveAt: new Date(),
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 100000),
        },
      ];
      prismaService.userSession.findMany.mockResolvedValue(mockSessions);

      const result = await service.getSessions('user-123', 'session-1');
      expect(result.sessions).toHaveLength(2);
      expect(result.sessions[0].isCurrent).toBe(true);
      expect(result.sessions[1].isCurrent).toBe(false);
    });

    it('should revoke a session and mark user logged out if no sessions remain', async () => {
      prismaService.userSession.findFirst.mockResolvedValue({
        id: 'session-1',
        userId: 'user-123',
        isRevoked: false,
      });
      prismaService.userSession.update.mockResolvedValue({ id: 'session-1', isRevoked: true });
      prismaService.userSession.count.mockResolvedValue(0);
      prismaService.user.update.mockResolvedValue({});

      const result = await service.revokeSession('user-123', 'session-1');
      expect(result.message).toBe('Session revoked successfully');
      expect(prismaService.userSession.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'session-1' },
          data: expect.objectContaining({ isRevoked: true, revocationReason: 'USER_REVOKED' }),
        }),
      );
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: { isLoggedIn: false },
      });
    });

    it('should logout of current session', async () => {
      prismaService.userSession.updateMany.mockResolvedValue({ count: 1 });
      prismaService.userSession.count.mockResolvedValue(0);
      prismaService.user.update.mockResolvedValue({});

      const result = await service.logout('user-123', 'session-current');
      expect(result.message).toBe('Logged out successfully');
      expect(prismaService.userSession.updateMany).toHaveBeenCalledWith({
        where: { id: 'session-current', userId: 'user-123', isRevoked: false },
        data: expect.objectContaining({ isRevoked: true, revocationReason: 'USER_LOGOUT' }),
      });
    });

    it('should logout of all devices and increment tokenVersion', async () => {
      prismaService.userSession.updateMany.mockResolvedValue({ count: 3 });
      prismaService.user.update.mockResolvedValue({});

      const result = await service.logoutAll('user-123');
      expect(result.message).toBe('Logged out of all devices and revoked all active sessions');
      expect(prismaService.userSession.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-123', isRevoked: false },
        data: expect.objectContaining({ isRevoked: true, revocationReason: 'ALL_SESSIONS_REVOKED' }),
      });
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: { tokenVersion: { increment: 1 }, isLoggedIn: false },
      });
    });
  });

  describe('Device Management', () => {
    it('should retrieve devices with active session counts', async () => {
      prismaService.userDevice.findMany.mockResolvedValue([
        {
          id: 'dev-1',
          deviceId: 'device-abc',
          name: 'Pixel 8',
          deviceType: DeviceType.ANDROID,
          ip: '10.0.0.1',
          location: 'Lagos',
          isPrimaryDevice: true,
          sessions: [{ id: 's-1' }, { id: 's-2' }],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const result = await service.getDevices('user-123');
      expect(result.devices).toHaveLength(1);
      expect(result.devices[0].activeSessionsCount).toBe(2);
      expect(result.devices[0].isPrimaryDevice).toBe(true);
    });

    it('should set primary device', async () => {
      prismaService.userDevice.findFirst.mockResolvedValue({ id: 'dev-1', deviceId: 'device-abc' });
      prismaService.userDevice.updateMany.mockResolvedValue({ count: 1 });
      prismaService.userDevice.update.mockResolvedValue({ id: 'dev-1', isPrimaryDevice: true });

      const result = await service.setPrimaryDevice('user-123', 'device-abc');
      expect(result.message).toBe('Primary device updated successfully');
      expect(prismaService.userDevice.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-123', isPrimaryDevice: true },
        data: { isPrimaryDevice: false },
      });
      expect(prismaService.userDevice.update).toHaveBeenCalledWith({
        where: { id: 'dev-1' },
        data: { isPrimaryDevice: true },
      });
    });

    it('should remove device and revoke its active sessions', async () => {
      prismaService.userDevice.findFirst.mockResolvedValue({ id: 'dev-1', deviceId: 'device-abc' });
      prismaService.userDevice.update.mockResolvedValue({ id: 'dev-1', isDeleted: true });
      prismaService.userSession.updateMany.mockResolvedValue({ count: 2 });

      const result = await service.removeDevice('user-123', 'device-abc');
      expect(result.message).toBe('Device removed and its active sessions revoked successfully');
      expect(prismaService.userDevice.update).toHaveBeenCalledWith({
        where: { id: 'dev-1' },
        data: expect.objectContaining({ isDeleted: true, isPrimaryDevice: false }),
      });
      expect(prismaService.userSession.updateMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-123',
          OR: [{ deviceId: 'device-abc' }, { userDeviceId: 'dev-1' }],
          isRevoked: false,
        },
        data: expect.objectContaining({ isRevoked: true, revocationReason: 'DEVICE_REMOVED' }),
      });
    });
  });

  describe('biometric login (asymmetric key-pair challenge verification)', () => {
    it('should register a valid ECDSA P-256 public key (PEM) for a device', async () => {
      const { publicKey } = crypto.generateKeyPairSync('ec', {
        namedCurve: 'prime256v1',
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });

      prismaService.user.findUnique.mockResolvedValue({
        id: 'user-123',
        isDeleted: false,
      });
      prismaService.userDevice.upsert.mockResolvedValue({
        id: 'ud-1',
        userId: 'user-123',
        deviceId: 'iphone-15',
        name: 'iPhone 15 Pro',
        deviceType: DeviceType.IOS,
        biometricEnabled: true,
        biometricKeyAlgorithm: 'ES256',
        biometricEnrolledAt: new Date(),
      });
      prismaService.biometricChallenge.updateMany.mockResolvedValue({
        count: 0,
      });

      const result = await service.registerBiometricKey(
        'user-123',
        {
          deviceId: 'iphone-15',
          publicKey,
          deviceName: 'iPhone 15 Pro',
          deviceType: DeviceType.IOS,
        },
        '10.0.0.1',
      );

      expect(result.message).toBe(
        'Biometric login enabled for device successfully',
      );
      expect(result.device.biometricEnabled).toBe(true);
      expect(result.device.biometricKeyAlgorithm).toBe('ES256');
      expect(prismaService.userDevice.upsert).toHaveBeenCalled();
    });

    it('should accept a raw base64-encoded SPKI DER public key', async () => {
      const { publicKey } = crypto.generateKeyPairSync('ec', {
        namedCurve: 'prime256v1',
        publicKeyEncoding: { type: 'spki', format: 'der' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });

      prismaService.user.findUnique.mockResolvedValue({
        id: 'user-123',
        isDeleted: false,
      });
      prismaService.userDevice.upsert.mockResolvedValue({
        id: 'ud-1',
        userId: 'user-123',
        deviceId: 'iphone-15',
        name: null,
        deviceType: DeviceType.IOS,
        biometricEnabled: true,
        biometricKeyAlgorithm: 'ES256',
        biometricEnrolledAt: new Date(),
      });
      prismaService.biometricChallenge.updateMany.mockResolvedValue({
        count: 0,
      });

      const result = await service.registerBiometricKey('user-123', {
        deviceId: 'iphone-15',
        publicKey: publicKey.toString('base64'),
      });

      expect(result.device.biometricEnabled).toBe(true);
      expect(result.device.biometricKeyAlgorithm).toBe('ES256');
    });

    it('should reject malformed public keys during registration', async () => {
      prismaService.user.findUnique.mockResolvedValue({
        id: 'user-123',
        isDeleted: false,
      });

      await expect(
        service.registerBiometricKey('user-123', {
          deviceId: 'iphone-15',
          publicKey: 'not-a-valid-key',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should issue a one-time biometric challenge for an enrolled device', async () => {
      prismaService.userDevice.findMany.mockResolvedValue([
        {
          id: 'ud-1',
          userId: 'user-123',
          deviceId: 'iphone-15',
          biometricEnabled: true,
          biometricPublicKey: 'pem-key',
          isDeleted: false,
        },
      ]);
      prismaService.biometricChallenge.updateMany.mockResolvedValue({
        count: 1,
      });
      prismaService.biometricChallenge.create.mockImplementation(
        async ({ data }) => ({
          id: 'challenge-1',
          ...data,
        }),
      );

      const result = await service.createBiometricChallenge({
        deviceId: 'iphone-15',
      });

      expect(result.challengeId).toBe('challenge-1');
      expect(typeof result.challenge).toBe('string');
      expect(result.challenge.length).toBeGreaterThanOrEqual(32);
      expect(result.expiresAt).toBeInstanceOf(Date);
    });

    it('should throw UnauthorizedException when requesting a challenge for an unenrolled device', async () => {
      prismaService.userDevice.findMany.mockResolvedValue([]);

      await expect(
        service.createBiometricChallenge({ deviceId: 'unknown-device' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should verify a valid ECDSA P-256 signature and issue session + tokens', async () => {
      const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
        namedCurve: 'prime256v1',
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });
      const challengeStr = crypto.randomBytes(32).toString('base64url');
      const signature = crypto
        .sign('sha256', Buffer.from(challengeStr, 'utf8'), privateKey)
        .toString('base64');

      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        phone: null,
        password: 'secret',
        transactionPin: 'hashed-pin',
        tokenVersion: 1,
        isDeleted: false,
        pockets: [],
        virtualAccounts: [],
        tag: null,
      };

      prismaService.biometricChallenge.findUnique.mockResolvedValue({
        id: 'challenge-1',
        userId: 'user-123',
        userDeviceId: 'ud-1',
        deviceId: 'iphone-15',
        challenge: challengeStr,
        isUsed: false,
        expiresAt: new Date(Date.now() + 60_000),
        user: mockUser,
        device: {
          id: 'ud-1',
          deviceId: 'iphone-15',
          isDeleted: false,
          biometricEnabled: true,
          biometricPublicKey: publicKey,
        },
      });
      prismaService.biometricChallenge.updateMany.mockResolvedValue({
        count: 1,
      });
      prismaService.user.update.mockResolvedValue(mockUser);
      prismaService.userDevice.update.mockResolvedValue({ id: 'ud-1' });
      prismaService.userSession.create.mockResolvedValue({
        id: 'session-bio-1',
        userId: 'user-123',
        deviceId: 'iphone-15',
      });
      prismaService.userSession.update.mockResolvedValue({
        id: 'session-bio-1',
      });

      const result = await service.verifyBiometricLogin(
        {
          deviceId: 'iphone-15',
          challengeId: 'challenge-1',
          signature,
        },
        '10.0.0.1',
        'SpikeApp/1.0 iOS',
      );

      expect(result.message).toBe('Biometric authentication successful');
      expect(result.sessionId).toBe('session-bio-1');
      expect(result.accessToken).toBe('mock-jwt-token');
      expect(result.refreshToken).toBe('mock-jwt-token');
      expect((result.user as Record<string, unknown>).password).toBeUndefined();
      expect(
        (result.user as Record<string, unknown>).transactionPin,
      ).toBeUndefined();
    });

    it('should verify a valid IEEE P1363 ECDSA signature', async () => {
      const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
        namedCurve: 'prime256v1',
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });
      const challengeStr = crypto.randomBytes(32).toString('base64url');
      const signature = crypto
        .sign('sha256', Buffer.from(challengeStr, 'utf8'), {
          key: privateKey,
          dsaEncoding: 'ieee-p1363',
        })
        .toString('base64');

      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        phone: null,
        tokenVersion: 0,
        isDeleted: false,
        pockets: [],
        virtualAccounts: [],
        tag: null,
      };

      prismaService.biometricChallenge.findUnique.mockResolvedValue({
        id: 'challenge-p1363',
        userId: 'user-123',
        userDeviceId: 'ud-1',
        deviceId: 'iphone-15',
        challenge: challengeStr,
        isUsed: false,
        expiresAt: new Date(Date.now() + 60_000),
        user: mockUser,
        device: {
          id: 'ud-1',
          deviceId: 'iphone-15',
          isDeleted: false,
          biometricEnabled: true,
          biometricPublicKey: publicKey,
        },
      });
      prismaService.biometricChallenge.updateMany.mockResolvedValue({
        count: 1,
      });
      prismaService.user.update.mockResolvedValue(mockUser);
      prismaService.userSession.create.mockResolvedValue({
        id: 'session-bio-2',
      });
      prismaService.userSession.update.mockResolvedValue({
        id: 'session-bio-2',
      });

      const result = await service.verifyBiometricLogin({
        deviceId: 'iphone-15',
        challengeId: 'challenge-p1363',
        signature,
      });

      expect(result.sessionId).toBe('session-bio-2');
    });

    it('should reject an invalid biometric signature', async () => {
      const { publicKey } = crypto.generateKeyPairSync('ec', {
        namedCurve: 'prime256v1',
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });
      const { privateKey: wrongPrivateKey } = crypto.generateKeyPairSync('ec', {
        namedCurve: 'prime256v1',
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });
      const challengeStr = crypto.randomBytes(32).toString('base64url');
      const badSignature = crypto
        .sign('sha256', Buffer.from(challengeStr, 'utf8'), wrongPrivateKey)
        .toString('base64');

      prismaService.biometricChallenge.findUnique.mockResolvedValue({
        id: 'challenge-bad',
        userId: 'user-123',
        userDeviceId: 'ud-1',
        deviceId: 'iphone-15',
        challenge: challengeStr,
        isUsed: false,
        expiresAt: new Date(Date.now() + 60_000),
        user: { id: 'user-123', isDeleted: false },
        device: {
          id: 'ud-1',
          deviceId: 'iphone-15',
          isDeleted: false,
          biometricEnabled: true,
          biometricPublicKey: publicKey,
        },
      });

      await expect(
        service.verifyBiometricLogin({
          deviceId: 'iphone-15',
          challengeId: 'challenge-bad',
          signature: badSignature,
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should reject an expired biometric challenge', async () => {
      prismaService.biometricChallenge.findUnique.mockResolvedValue({
        id: 'challenge-expired',
        userId: 'user-123',
        userDeviceId: 'ud-1',
        deviceId: 'iphone-15',
        challenge: 'some-nonce',
        isUsed: false,
        expiresAt: new Date(Date.now() - 10_000),
        user: { id: 'user-123', isDeleted: false },
        device: {
          id: 'ud-1',
          deviceId: 'iphone-15',
          isDeleted: false,
          biometricEnabled: true,
          biometricPublicKey: 'pem',
        },
      });
      prismaService.biometricChallenge.updateMany.mockResolvedValue({
        count: 1,
      });

      await expect(
        service.verifyBiometricLogin({
          deviceId: 'iphone-15',
          challengeId: 'challenge-expired',
          signature: 'ZmFrZQ==',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should disable biometric login and clear stored public key', async () => {
      prismaService.userDevice.findFirst.mockResolvedValue({
        id: 'ud-1',
        userId: 'user-123',
        deviceId: 'iphone-15',
      });
      prismaService.userDevice.update.mockResolvedValue({ id: 'ud-1' });
      prismaService.biometricChallenge.updateMany.mockResolvedValue({
        count: 1,
      });

      const result = await service.disableBiometric('user-123', 'iphone-15');

      expect(result.message).toBe(
        'Biometric login disabled for device successfully',
      );
      expect(prismaService.userDevice.update).toHaveBeenCalledWith({
        where: { id: 'ud-1' },
        data: {
          biometricEnabled: false,
          biometricPublicKey: null,
          biometricKeyAlgorithm: null,
          biometricEnrolledAt: null,
        },
      });
    });
  });

  describe('PIN recovery, restoration and reset', () => {
    it('should dispatch recovery OTP to user email and record audit log', async () => {
      prismaService.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'alice@example.com',
        phone: '+2348012345678',
      });
      prismaService.otp.updateMany.mockResolvedValue({ count: 0 });
      prismaService.otp.create.mockResolvedValue({ id: 'otp-1' });

      const result = await service.requestPinRecoveryOtp(
        'user-123',
        { channel: 'email' },
        '10.0.0.1',
      );

      expect(result.method).toBe('EMAIL');
      expect(result.target).toBe('al***@example.com');
      expect(prismaService.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: 'PIN_RECOVERY_OTP_REQUESTED',
            actorId: 'user-123',
          }),
        }),
      );
    });

    it('should restore locked PIN authorization after valid OTP verification', async () => {
      prismaService.user.findUnique.mockResolvedValue({
        id: 'user-123',
        pinFailedAttempts: 5,
        pinLockedUntil: new Date(Date.now() + 10 * 60_000),
        pinRequiresRecovery: true,
        pinLockoutCount: 1,
        bvn: null,
      });
      prismaService.otp.findFirst.mockResolvedValue({
        id: 'otp-99',
        userId: 'user-123',
        code: '654321',
        isUsed: false,
        expiresAt: new Date(Date.now() + 5 * 60_000),
      });
      prismaService.otp.update.mockResolvedValue({ id: 'otp-99', isUsed: true });
      prismaService.user.update.mockResolvedValue({ id: 'user-123' });

      const result = await service.restorePinAuthorization(
        'user-123',
        { otpCode: '654321' },
        '10.0.0.1',
      );

      expect(result.restored).toBe(true);
      expect(result.verificationMethods).toEqual(['OTP']);
      expect(prismaService.otp.update).toHaveBeenCalledWith({
        where: { id: 'otp-99' },
        data: { isUsed: true },
      });
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: expect.objectContaining({
          pinFailedAttempts: 0,
          pinLockedUntil: null,
          pinRequiresRecovery: false,
          lastPinFailedAt: null,
        }),
      });
      const auditSerialized = JSON.stringify(
        prismaService.auditLog.create.mock.calls,
      );
      expect(auditSerialized).toContain('PIN_RESTORED');
      expect(auditSerialized).not.toContain('654321');
    });

    it('should restore locked PIN authorization after valid KYC (BVN) verification', async () => {
      prismaService.user.findUnique.mockResolvedValue({
        id: 'user-123',
        pinFailedAttempts: 5,
        pinLockedUntil: new Date(Date.now() + 10 * 60_000),
        pinRequiresRecovery: true,
        pinLockoutCount: 1,
        bvn: '22233344455',
      });
      prismaService.user.update.mockResolvedValue({ id: 'user-123' });

      const result = await service.restorePinAuthorization(
        'user-123',
        { bvn: '22233344455' },
        '10.0.0.2',
      );

      expect(result.restored).toBe(true);
      expect(result.verificationMethods).toEqual(['KYC']);
      const auditSerialized = JSON.stringify(
        prismaService.auditLog.create.mock.calls,
      );
      expect(auditSerialized).not.toContain('22233344455');
    });

    it('should require BOTH OTP and KYC (BVN) on repeated lockouts when BVN is on file', async () => {
      prismaService.user.findUnique.mockResolvedValue({
        id: 'user-123',
        pinFailedAttempts: 5,
        pinLockedUntil: new Date(Date.now() + 10 * 60_000),
        pinRequiresRecovery: true,
        pinLockoutCount: 2,
        bvn: '22233344455',
      });

      await expect(
        service.restorePinAuthorization('user-123', { otpCode: '654321' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should record PIN_SUSPICIOUS_ACTIVITY on failed KYC verification', async () => {
      prismaService.user.findUnique.mockResolvedValue({
        id: 'user-123',
        pinRequiresRecovery: true,
        pinLockoutCount: 1,
        bvn: '22233344455',
      });

      await expect(
        service.restorePinAuthorization(
          'user-123',
          { bvn: '99999999999' },
          '10.0.0.5',
        ),
      ).rejects.toThrow(BadRequestException);

      expect(prismaService.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: 'PIN_SUSPICIOUS_ACTIVITY',
            metadata: expect.objectContaining({
              reason: 'FAILED_RECOVERY_VERIFICATION',
              factor: 'KYC_BVN',
            }),
          }),
        }),
      );
    });

    it('should reset PIN, clear lockout, and record PIN_RESET without logging new PIN', async () => {
      prismaService.user.findUnique.mockResolvedValue({
        id: 'user-123',
        pinFailedAttempts: 5,
        pinRequiresRecovery: true,
        pinLockoutCount: 1,
        bvn: '22233344455',
      });
      prismaService.user.update.mockResolvedValue({ id: 'user-123' });

      const result = await service.resetPin(
        'user-123',
        { bvn: '22233344455', newPin: '7890' },
        '10.0.0.7',
      );

      expect(result.restored).toBe(true);
      expect(result.pinReset).toBe(true);
      const auditSerialized = JSON.stringify(
        prismaService.auditLog.create.mock.calls,
      );
      expect(auditSerialized).toContain('PIN_RESET');
      expect(auditSerialized).not.toContain('7890');
    });
  });
});
