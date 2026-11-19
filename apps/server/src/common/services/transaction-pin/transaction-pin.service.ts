import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@spike/database';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import {
  DEFAULT_MAX_FAILED_PIN_ATTEMPTS,
  DEFAULT_PIN_LOCKOUT_DURATION_MS,
  MAX_ALLOWED_FAILED_PIN_ATTEMPTS,
  MIN_ALLOWED_FAILED_PIN_ATTEMPTS,
  PIN_AUDIT_ENTITY_TYPE,
  PinAuditAction,
  PinVerificationContext,
  RAPID_FAILURE_THRESHOLD,
  RAPID_FAILURE_WINDOW_MS,
  sanitizePinAuditMetadata,
} from './transaction-pin.constants';

export class PinLockedException extends HttpException {
  constructor(message: string) {
    super(
      {
        statusCode: HttpStatus.LOCKED,
        error: 'PIN_LOCKED',
        message,
      },
      HttpStatus.LOCKED,
    );
  }
}

@Injectable()
export class TransactionPinService {
  private readonly logger = new Logger(TransactionPinService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Optional() private readonly configService?: ConfigService,
  ) {}

  getMaxFailedAttempts(): number {
    const configured = Number(
      this.configService?.get?.('PIN_MAX_FAILED_ATTEMPTS'),
    );
    if (
      Number.isInteger(configured) &&
      configured >= MIN_ALLOWED_FAILED_PIN_ATTEMPTS &&
      configured <= MAX_ALLOWED_FAILED_PIN_ATTEMPTS
    ) {
      return configured;
    }
    return DEFAULT_MAX_FAILED_PIN_ATTEMPTS;
  }

  getLockoutDurationMs(): number {
    const configuredMinutes = Number(
      this.configService?.get?.('PIN_LOCKOUT_DURATION_MINUTES'),
    );
    if (Number.isFinite(configuredMinutes) && configuredMinutes > 0) {
      return Math.round(configuredMinutes * 60 * 1000);
    }
    return DEFAULT_PIN_LOCKOUT_DURATION_MS;
  }

  /**
   * Verifies a user's 4-digit transaction PIN with consecutive failure tracking,
   * temporary lockout after 3-5 failed attempts, suspicious activity detection,
   * and audit logging (strictly without logging the PIN itself).
   */
  async verifyPin(
    userId: string,
    pin: string,
    context?: PinVerificationContext,
  ): Promise<{ message: string; valid: true }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.transactionPin) {
      throw new BadRequestException(
        'Transaction PIN has not been set up. Please create a PIN first.',
      );
    }

    const now = new Date();
    const maxAttempts = this.getMaxFailedAttempts();
    const lockedUntil = user.pinLockedUntil ?? null;
    const isTemporarilyLocked = Boolean(lockedUntil && lockedUntil > now);
    const requiresRecovery = Boolean(user.pinRequiresRecovery);

    // Block immediately when locked or awaiting OTP/KYC restoration
    if (isTemporarilyLocked || requiresRecovery) {
      await this.recordAuditEvent({
        userId,
        action: PinAuditAction.PIN_SUSPICIOUS_ACTIVITY,
        ip: context?.ip,
        metadata: {
          reason: 'ATTEMPT_WHILE_LOCKED',
          operation: context?.action ?? 'VERIFY_PIN',
          endpoint: context?.endpoint,
          deviceId: context?.deviceId,
          sessionId: context?.sessionId,
          userAgent: context?.userAgent,
          lockedUntil: lockedUntil?.toISOString() ?? null,
          requiresRecovery,
          lockoutCount: user.pinLockoutCount ?? 0,
        },
      });

      if (isTemporarilyLocked && lockedUntil) {
        const remainingMinutes = Math.max(
          1,
          Math.ceil((lockedUntil.getTime() - now.getTime()) / 60000),
        );
        throw new PinLockedException(
          `Transaction PIN is temporarily locked for ${remainingMinutes} more minute(s) due to consecutive failed attempts. Complete OTP and/or KYC verification to restore PIN authorization.`,
        );
      }

      throw new PinLockedException(
        'Transaction PIN authorization is locked due to previous failed attempts. Complete OTP and/or KYC verification to restore PIN authorization.',
      );
    }

    const normalizedPin = typeof pin === 'string' ? pin.trim() : '';
    const isFormatValid = /^\d{4}$/.test(normalizedPin);
    const isValid =
      isFormatValid && (await bcrypt.compare(normalizedPin, user.transactionPin));

    if (!isValid) {
      const currentFailedAttempts = user.pinFailedAttempts ?? 0;
      const newFailedAttempts = currentFailedAttempts + 1;
      const previousFailedAt = user.lastPinFailedAt ?? null;
      const isRapidBurst = Boolean(
        previousFailedAt &&
          now.getTime() - previousFailedAt.getTime() <= RAPID_FAILURE_WINDOW_MS,
      );

      if (newFailedAttempts >= maxAttempts) {
        const lockoutDurationMs = this.getLockoutDurationMs();
        const newLockedUntil = new Date(now.getTime() + lockoutDurationMs);
        const newLockoutCount = (user.pinLockoutCount ?? 0) + 1;
        const lockoutMinutes = Math.round(lockoutDurationMs / 60000);

        await this.prisma.user.update({
          where: { id: userId },
          data: {
            pinFailedAttempts: newFailedAttempts,
            pinLockedUntil: newLockedUntil,
            pinRequiresRecovery: true,
            pinLockoutCount: newLockoutCount,
            lastPinFailedAt: now,
          },
        });

        await this.recordAuditEvent({
          userId,
          action: PinAuditAction.PIN_AUTH_FAILED,
          ip: context?.ip,
          metadata: {
            operation: context?.action ?? 'VERIFY_PIN',
            endpoint: context?.endpoint,
            deviceId: context?.deviceId,
            sessionId: context?.sessionId,
            userAgent: context?.userAgent,
            failedAttempts: newFailedAttempts,
            remainingAttempts: 0,
            maxAttempts,
            formatValid: isFormatValid,
            triggeredLockout: true,
          },
        });

        await this.recordAuditEvent({
          userId,
          action: PinAuditAction.PIN_LOCKED,
          ip: context?.ip,
          metadata: {
            operation: context?.action ?? 'VERIFY_PIN',
            endpoint: context?.endpoint,
            deviceId: context?.deviceId,
            sessionId: context?.sessionId,
            failedAttempts: newFailedAttempts,
            lockoutCount: newLockoutCount,
            lockoutDurationMinutes: lockoutMinutes,
            lockedUntil: newLockedUntil.toISOString(),
            requiresRecovery: true,
          },
        });

        if (newLockoutCount >= 2 || isRapidBurst) {
          await this.recordAuditEvent({
            userId,
            action: PinAuditAction.PIN_SUSPICIOUS_ACTIVITY,
            ip: context?.ip,
            metadata: {
              reason:
                newLockoutCount >= 2
                  ? 'REPEATED_LOCKOUT'
                  : 'RAPID_BRUTE_FORCE_LOCKOUT',
              operation: context?.action ?? 'VERIFY_PIN',
              endpoint: context?.endpoint,
              deviceId: context?.deviceId,
              sessionId: context?.sessionId,
              failedAttempts: newFailedAttempts,
              lockoutCount: newLockoutCount,
            },
          });
        }

        throw new PinLockedException(
          `Transaction PIN has been temporarily locked for ${lockoutMinutes} minutes after ${newFailedAttempts} consecutive failed attempts. Complete OTP and/or KYC verification to restore PIN authorization.`,
        );
      }

      const remainingAttempts = maxAttempts - newFailedAttempts;

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          pinFailedAttempts: newFailedAttempts,
          lastPinFailedAt: now,
        },
      });

      await this.recordAuditEvent({
        userId,
        action: PinAuditAction.PIN_AUTH_FAILED,
        ip: context?.ip,
        metadata: {
          operation: context?.action ?? 'VERIFY_PIN',
          endpoint: context?.endpoint,
          deviceId: context?.deviceId,
          sessionId: context?.sessionId,
          userAgent: context?.userAgent,
          failedAttempts: newFailedAttempts,
          remainingAttempts,
          maxAttempts,
          formatValid: isFormatValid,
          triggeredLockout: false,
        },
      });

      if (newFailedAttempts >= RAPID_FAILURE_THRESHOLD && isRapidBurst) {
        await this.recordAuditEvent({
          userId,
          action: PinAuditAction.PIN_SUSPICIOUS_ACTIVITY,
          ip: context?.ip,
          metadata: {
            reason: 'RAPID_FAILED_ATTEMPTS',
            operation: context?.action ?? 'VERIFY_PIN',
            endpoint: context?.endpoint,
            deviceId: context?.deviceId,
            sessionId: context?.sessionId,
            failedAttempts: newFailedAttempts,
            remainingAttempts,
          },
        });
      }

      throw new BadRequestException(
        `Incorrect transaction PIN. ${remainingAttempts} attempt(s) remaining before temporary lockout.`,
      );
    }

    // Successful verification resets consecutive failure counter
    if ((user.pinFailedAttempts ?? 0) > 0 || user.lastPinFailedAt) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          pinFailedAttempts: 0,
          lastPinFailedAt: null,
        },
      });
    }

    return {
      message: 'Transaction PIN verified successfully',
      valid: true,
    };
  }

  /**
   * Returns current PIN lock/attempt status without exposing any sensitive fields.
   */
  async getPinStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        transactionPin: true,
        pinFailedAttempts: true,
        pinLockedUntil: true,
        pinRequiresRecovery: true,
        pinLockoutCount: true,
        lastPinFailedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const now = new Date();
    const maxAttempts = this.getMaxFailedAttempts();
    const failedAttempts = user.pinFailedAttempts ?? 0;
    const isTemporarilyLocked = Boolean(
      user.pinLockedUntil && user.pinLockedUntil > now,
    );
    const requiresRecovery = Boolean(user.pinRequiresRecovery);
    const isLocked = isTemporarilyLocked || requiresRecovery;

    return {
      hasPin: Boolean(user.transactionPin),
      isLocked,
      isTemporarilyLocked,
      requiresRecovery,
      lockedUntil: isTemporarilyLocked ? user.pinLockedUntil : null,
      failedAttempts,
      remainingAttempts: isLocked
        ? 0
        : Math.max(0, maxAttempts - failedAttempts),
      maxAttempts,
      lockoutCount: user.pinLockoutCount ?? 0,
      lastFailedAt: user.lastPinFailedAt ?? null,
    };
  }

  /**
   * Records a PIN security event in AuditLog and emits a sanitized log entry.
   * Actual PINs, OTPs, BVNs, passwords, and tokens are stripped and never logged.
   */
  async recordAuditEvent(params: {
    userId: string;
    action: PinAuditAction;
    ip?: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    const sanitizedMetadata = sanitizePinAuditMetadata(params.metadata);

    if (
      params.action === PinAuditAction.PIN_LOCKED ||
      params.action === PinAuditAction.PIN_SUSPICIOUS_ACTIVITY ||
      params.action === PinAuditAction.PIN_AUTH_FAILED
    ) {
      this.logger.warn(
        `[${params.action}] user=${params.userId} ip=${params.ip ?? 'unknown'} meta=${JSON.stringify(sanitizedMetadata ?? {})}`,
      );
    } else {
      this.logger.log(
        `[${params.action}] user=${params.userId} ip=${params.ip ?? 'unknown'}`,
      );
    }

    try {
      if (this.prisma.auditLog?.create) {
        await this.prisma.auditLog.create({
          data: {
            actorId: params.userId,
            action: params.action,
            entityType: PIN_AUDIT_ENTITY_TYPE,
            entityId: params.userId,
            ip: params.ip ?? null,
            metadata: sanitizedMetadata as Prisma.InputJsonValue | undefined,
          },
        });
      }
    } catch (error) {
      this.logger.error(
        `Failed to persist PIN audit log (${params.action}) for user ${params.userId}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
