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
  };

  beforeEach(async () => {
    mockUserAuthService = {
      registerPushToken: jest.fn(),
      registerDevice: jest.fn(),
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

      const res = await controller.registerDevice('user-1', dto, req);
      expect(res).toBe(mockResult);
      expect(mockUserAuthService.registerDevice).toHaveBeenCalledWith(
        'user-1',
        dto,
        '127.0.0.1',
      );
    });
  });
});
