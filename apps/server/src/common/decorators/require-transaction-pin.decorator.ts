import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import {
  TransactionPinGuard,
  TransactionPinRequirement,
} from '../guards/transaction-pin.guard';
import {
  REQUIRE_TRANSACTION_PIN_KEY,
  TRANSACTION_PIN_HEADER,
} from '../services/transaction-pin/transaction-pin.constants';

/**
 * Protects a sensitive financial endpoint with both JWT session authentication (AuthGuard)
 * and 4-digit transaction PIN authorization (TransactionPinGuard).
 *
 * Clients may supply the PIN via the `x-transaction-pin` request header or the
 * `transactionPin` (or `pin`) request body field.
 */
export function RequireTransactionPin(
  options?: string | TransactionPinRequirement,
) {
  const config: TransactionPinRequirement =
    typeof options === 'string' ? { action: options } : (options ?? {});
  const headerName = config.headerName ?? TRANSACTION_PIN_HEADER;

  return applyDecorators(
    SetMetadata(REQUIRE_TRANSACTION_PIN_KEY, config),
    UseGuards(AuthGuard, TransactionPinGuard),
    ApiBearerAuth(),
    ApiHeader({
      name: headerName,
      required: false,
      description:
        '4-digit numeric transaction PIN (can alternatively be sent in the request body as transactionPin)',
    }),
  );
}
