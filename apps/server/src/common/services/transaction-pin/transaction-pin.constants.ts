export const DEFAULT_MAX_FAILED_PIN_ATTEMPTS = 5;
export const MIN_ALLOWED_FAILED_PIN_ATTEMPTS = 3;
export const MAX_ALLOWED_FAILED_PIN_ATTEMPTS = 5;

export const DEFAULT_PIN_LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
export const RAPID_FAILURE_WINDOW_MS = 2 * 60 * 1000; // 2 minutes
export const RAPID_FAILURE_THRESHOLD = 3;

export const TRANSACTION_PIN_HEADER = 'x-transaction-pin';
export const REQUIRE_TRANSACTION_PIN_KEY = 'requireTransactionPin';

export const PIN_AUDIT_ENTITY_TYPE = 'USER_PIN';

export enum PinAuditAction {
  PIN_CREATED = 'PIN_CREATED',
  PIN_AUTH_FAILED = 'PIN_AUTH_FAILED',
  PIN_LOCKED = 'PIN_LOCKED',
  PIN_RESTORED = 'PIN_RESTORED',
  PIN_RESET = 'PIN_RESET',
  PIN_CHANGED = 'PIN_CHANGED',
  PIN_RECOVERY_OTP_REQUESTED = 'PIN_RECOVERY_OTP_REQUESTED',
  PIN_SUSPICIOUS_ACTIVITY = 'PIN_SUSPICIOUS_ACTIVITY',
}

export interface PinVerificationContext {
  action?: string;
  endpoint?: string;
  ip?: string;
  userAgent?: string;
  deviceId?: string;
  sessionId?: string;
}

const SENSITIVE_KEY_PATTERN =
  /(pin|password|passcode|otp|code|bvn|nin|secret|token|authorization)/i;

/**
 * Recursively strips any key that could hold a raw PIN, OTP, BVN, password, or token
 * before persisting metadata to AuditLog or emitting structured logs.
 */
export function sanitizePinAuditMetadata(
  metadata?: Record<string, unknown>,
): Record<string, unknown> | undefined {
  if (!metadata) {
    return undefined;
  }

  const sanitizeValue = (value: unknown): unknown => {
    if (Array.isArray(value)) {
      return value.map((item) => sanitizeValue(item));
    }
    if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
      const cleaned: Record<string, unknown> = {};
      for (const [key, entry] of Object.entries(
        value as Record<string, unknown>,
      )) {
        if (SENSITIVE_KEY_PATTERN.test(key)) {
          continue;
        }
        cleaned[key] = sanitizeValue(entry);
      }
      return cleaned;
    }
    return value;
  };

  return sanitizeValue(metadata) as Record<string, unknown>;
}
