import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticatedRequest } from './auth.guard';
import {
  PinAuditAction,
  REQUIRE_TRANSACTION_PIN_KEY,
  TRANSACTION_PIN_HEADER,
} from '../services/transaction-pin/transaction-pin.constants';
import { TransactionPinService } from '../services/transaction-pin/transaction-pin.service';

export interface TransactionPinRequirement {
  action?: string;
  headerName?: string;
  bodyField?: string;
}

export interface PinAuthorizedRequest extends AuthenticatedRequest {
  pinVerified?: boolean;
}

@Injectable()
export class TransactionPinGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly transactionPinService: TransactionPinService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requirement = this.reflector.getAllAndOverride<
      TransactionPinRequirement | boolean | undefined
    >(REQUIRE_TRANSACTION_PIN_KEY, [context.getHandler(), context.getClass()]);

    if (!requirement) {
      return true;
    }

    const request = context.switchToHttp().getRequest<PinAuthorizedRequest>();
    const userId = request.user?.sub;

    if (!userId) {
      throw new UnauthorizedException(
        'Authentication is required before transaction PIN verification',
      );
    }

    const config: TransactionPinRequirement =
      typeof requirement === 'object' ? requirement : {};
    const headerName = (config.headerName ?? TRANSACTION_PIN_HEADER).toLowerCase();
    const bodyField = config.bodyField ?? 'transactionPin';

    const headerValue = request.headers?.[headerName];
    const headerPin = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    const bodyRecord =
      request.body && typeof request.body === 'object'
        ? (request.body as Record<string, unknown>)
        : undefined;
    const bodyPin =
      typeof bodyRecord?.[bodyField] === 'string'
        ? bodyRecord[bodyField]
        : typeof bodyRecord?.pin === 'string'
          ? bodyRecord.pin
          : undefined;

    const pin = (headerPin ?? bodyPin)?.trim();

    const rawIp =
      (request.headers?.['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      request.ip ||
      request.socket?.remoteAddress;
    const userAgent = request.headers?.['user-agent'] as string | undefined;
    const endpoint = `${request.method} ${request.originalUrl || request.url}`;
    const action = config.action ?? endpoint;

    if (!pin) {
      await this.transactionPinService.recordAuditEvent({
        userId,
        action: PinAuditAction.PIN_AUTH_FAILED,
        ip: rawIp,
        metadata: {
          reason: 'PIN_MISSING',
          operation: action,
          endpoint,
          deviceId: request.user?.deviceId,
          sessionId: request.user?.sessionId,
          userAgent,
        },
      });
      throw new BadRequestException(
        `Transaction PIN is required. Provide it in the "${headerName}" header or "${bodyField}" body field.`,
      );
    }

    await this.transactionPinService.verifyPin(userId, pin, {
      action,
      endpoint,
      ip: rawIp,
      userAgent,
      deviceId: request.user?.deviceId,
      sessionId: request.user?.sessionId,
    });

    request.pinVerified = true;
    return true;
  }
}
