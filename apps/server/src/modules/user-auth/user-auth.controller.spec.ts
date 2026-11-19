jest.mock('@nestjs/swagger', () => ({
  ApiTags: () => () => {},
  ApiOperation: () => () => {},
  ApiQuery: () => () => {},
  ApiResponse: () => () => {},
  ApiBearerAuth: () => () => {},
  ApiProperty: () => () => {},
  ApiPropertyOptional: () => () => {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { UserAuthController } from './user-auth.controller';
import { UserAuthService } from './user-auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DeviceType } from '@spike/database';
import { RegisterPushTokenDto } from './dto/registerPushTokenDto';
import { RegisterDeviceDto } from './dto/registerDeviceDto';
import { Request } from 'express';

describe('UserAuthController', () => {
  let controller: UserAuthController;
  let mockUserAuthService: {
    registerPushToken: jest.Mock;
    registerDevice: jest.Mock;
    registerBiometricKey: jest.Mock;
    disableBiometric: jest.Mock;
    createBiometricChallenge: jest.Mock;
    verifyBiometricLogin: jest.Mock;
  };

  beforeEach(async () => {
    mockUserAuthService = {
      registerPushToken: jest.fn(),
      registerDevice: jest.fn(),
      registerBiometricKey: jest.fn(),
      disableBiometric: jest.fn(),
      createBiometricChallenge: jest.fn(),
      verifyBiometricLogin: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAuthController],
      providers: [
        {
          provide: UserAuthService,
          useValue: mockUserAuthService,
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue('mock-secret'),
          },
        },
      ],
    }).compile();

    controller = module.get<UserAuthController>(UserAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registerPushToken', () => {
    it('should call userAuthService.registerPushToken with user id and dto', async () => {
      const mockResult = {
        message: 'Push token registered successfully',
        pushToken: 'push-123',
      };
      mockUserAuthService.registerPushToken.mockResolvedValue(mockResult);

      const dto: RegisterPushTokenDto = { pushToken: 'push-123' };

      const res = await controller.registerPushToken('user-1', dto);
      expect(res).toBe(mockResult);
      expect(mockUserAuthService.registerPushToken).toHaveBeenCalledWith(
        'user-1',
        dto,
      );
    });
  });

  describe('registerDevice', () => {
    it('should call userAuthService.registerDevice with client ip fallback', async () => {
      const mockResult = {
        message: 'Device registered successfully',
        device: {
          id: 'd-1',
          userId: 'user-1',
          deviceId: 'device-abc',
          deviceType: DeviceType.IOS,
          ip: '127.0.0.1',
          location: null,
          name: null,
          isDeleted: false,
          deletedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      mockUserAuthService.registerDevice.mockResolvedValue(mockResult);

      const req = {
        ip: '127.0.0.1',
        headers: {},
      } as unknown as Request;
      const dto: RegisterDeviceDto = {
        deviceId: 'device-abc',
        deviceType: DeviceType.IOS,
      };

      const res = await controller.registerDevice(
        'user-1',
        dto,
        req,
        'session-1',
      );
      expect(res).toBe(mockResult);
      expect(mockUserAuthService.registerDevice).toHaveBeenCalledWith(
        'user-1',
        dto,
        '127.0.0.1',
        'session-1',
      );
    });
  });

  describe('biometric endpoints', () => {
    it('should register biometric public key with ip and sessionId', async () => {
      const mockResult = {
        message: 'Biometric login enabled for device successfully',
      };
      mockUserAuthService.registerBiometricKey.mockResolvedValue(mockResult);

      const req = {
        ip: '10.0.0.2',
        headers: {},
      } as unknown as Request;
      const dto = {
        deviceId: 'iphone-15',
        publicKey: 'pem-key',
      };

      const res = await controller.registerBiometricKey(
        'user-1',
        'session-1',
        dto,
        req,
      );
      expect(res).toBe(mockResult);
      expect(mockUserAuthService.registerBiometricKey).toHaveBeenCalledWith(
        'user-1',
        dto,
        '10.0.0.2',
        'session-1',
      );
    });

    it('should disable biometric login for device', async () => {
      const mockResult = {
        message: 'Biometric login disabled for device successfully',
      };
      mockUserAuthService.disableBiometric.mockResolvedValue(mockResult);

      const res = await controller.disableBiometric('user-1', 'iphone-15');
      expect(res).toBe(mockResult);
      expect(mockUserAuthService.disableBiometric).toHaveBeenCalledWith(
        'user-1',
        'iphone-15',
      );
    });

    it('should issue biometric challenge', async () => {
      const mockResult = {
        challengeId: 'ch-1',
        challenge: 'nonce-123',
        expiresAt: new Date(),
      };
      mockUserAuthService.createBiometricChallenge.mockResolvedValue(
        mockResult,
      );

      const dto = { deviceId: 'iphone-15' };
      const res = await controller.createBiometricChallenge(dto);
      expect(res).toBe(mockResult);
      expect(mockUserAuthService.createBiometricChallenge).toHaveBeenCalledWith(
        dto,
      );
    });

    it('should verify biometric login with client ip and user-agent', async () => {
      const mockResult = {
        message: 'Biometric authentication successful',
        accessToken: 'access-jwt',
        refreshToken: 'refresh-jwt',
      };
      mockUserAuthService.verifyBiometricLogin.mockResolvedValue(mockResult);

      const req = {
        ip: '10.0.0.5',
        headers: { 'user-agent': 'SpikeApp/1.0 iOS' },
      } as unknown as Request;
      const dto = {
        deviceId: 'iphone-15',
        challengeId: 'ch-1',
        signature: 'base64sig==',
      };

      const res = await controller.verifyBiometricLogin(dto, req);
      expect(res).toBe(mockResult);
      expect(mockUserAuthService.verifyBiometricLogin).toHaveBeenCalledWith(
        dto,
        '10.0.0.5',
        'SpikeApp/1.0 iOS',
      );
    });
  });
});
