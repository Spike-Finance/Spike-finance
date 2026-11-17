-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REVERSED');

-- CreateEnum
CREATE TYPE "TransactionFlow" AS ENUM ('CREDIT', 'DEBIT');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('WALLET_TOP_UP', 'SAVINGS', 'BILLS', 'TRANSFER', 'WITHDRAWAL', 'INTEREST', 'FEE', 'REVERSAL', 'EARLY_BREAK_PENALTY');

-- CreateEnum
CREATE TYPE "LedgerAccountType" AS ENUM ('USER_POCKET', 'SETTLEMENT', 'FEES', 'BILLS', 'SUSPENSE', 'INTEREST_EXPENSE');

-- CreateEnum
CREATE TYPE "PocketStatus" AS ENUM ('ACTIVE', 'FROZEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "InterestAccrualStatus" AS ENUM ('ACCRUED', 'PAID', 'VOIDED');

-- CreateEnum
CREATE TYPE "KycTier" AS ENUM ('TIER_0', 'TIER_1', 'TIER_2', 'TIER_3');

-- CreateEnum
CREATE TYPE "ReconciliationStatus" AS ENUM ('PENDING', 'MATCHED', 'MISMATCH', 'RESOLVED');

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_pocketId_fkey";

-- AlterTable
ALTER TABLE "Pocket" DROP COLUMN "interestRate",
ADD COLUMN     "lastAccruedAt" DATE,
ADD COLUMN     "productId" TEXT,
ADD COLUMN     "status" "PocketStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "pocketId",
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'NGN',
ADD COLUMN     "externalReference" TEXT,
ADD COLUMN     "provider" TEXT,
ADD COLUMN     "senderId" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "TransactionType" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "TransactionStatus" NOT NULL DEFAULT 'SUCCESS';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "kycTier" "KycTier" NOT NULL DEFAULT 'TIER_0';

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavouriteTag" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FavouriteTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PocketType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "minDeposit" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "maxBalance" DECIMAL(19,4),
    "lockDays" INTEGER,
    "maxWithdrawalsPerMonth" INTEGER,
    "earlyBreakPenaltyRate" DECIMAL(7,6),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductRate" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "annualRate" DECIMAL(7,6) NOT NULL,
    "minBalance" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "maxBalance" DECIMAL(19,4),
    "effectiveFrom" DATE NOT NULL,
    "effectiveTo" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterestAccrual" (
    "id" TEXT NOT NULL,
    "pocketId" TEXT NOT NULL,
    "accrualDate" DATE NOT NULL,
    "balanceBasis" DECIMAL(19,4) NOT NULL,
    "annualRate" DECIMAL(7,6) NOT NULL,
    "amount" DECIMAL(19,8) NOT NULL,
    "status" "InterestAccrualStatus" NOT NULL DEFAULT 'ACCRUED',
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterestAccrual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyBalanceSnapshot" (
    "id" TEXT NOT NULL,
    "pocketId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "closingBalance" DECIMAL(19,4) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyBalanceSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerAccount" (
    "id" TEXT NOT NULL,
    "type" "LedgerAccountType" NOT NULL,
    "name" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "pocketId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerEntry" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "direction" "TransactionFlow" NOT NULL,
    "amount" DECIMAL(19,4) NOT NULL,
    "balanceAfter" DECIMAL(19,4),
    "balanceBefore" DECIMAL(19,4),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "metadata" JSONB,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reconciliation" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "ledgerTotal" DECIMAL(19,4) NOT NULL,
    "providerTotal" DECIMAL(19,4) NOT NULL,
    "difference" DECIMAL(19,4) NOT NULL,
    "status" "ReconciliationStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reconciliation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_userId_key" ON "Tag"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_tag_key" ON "Tag"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "FavouriteTag_userId_tag_key" ON "FavouriteTag"("userId", "tag");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");

-- CreateIndex
CREATE INDEX "ProductRate_productId_effectiveFrom_idx" ON "ProductRate"("productId", "effectiveFrom");

-- CreateIndex
CREATE UNIQUE INDEX "InterestAccrual_transactionId_key" ON "InterestAccrual"("transactionId");

-- CreateIndex
CREATE INDEX "InterestAccrual_status_accrualDate_idx" ON "InterestAccrual"("status", "accrualDate");

-- CreateIndex
CREATE UNIQUE INDEX "InterestAccrual_pocketId_accrualDate_key" ON "InterestAccrual"("pocketId", "accrualDate");

-- CreateIndex
CREATE UNIQUE INDEX "DailyBalanceSnapshot_pocketId_date_key" ON "DailyBalanceSnapshot"("pocketId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "LedgerAccount_pocketId_key" ON "LedgerAccount"("pocketId");

-- CreateIndex
CREATE INDEX "LedgerAccount_type_idx" ON "LedgerAccount"("type");

-- CreateIndex
CREATE INDEX "LedgerEntry_transactionId_idx" ON "LedgerEntry"("transactionId");

-- CreateIndex
CREATE INDEX "LedgerEntry_accountId_createdAt_idx" ON "LedgerEntry"("accountId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_createdAt_idx" ON "AuditLog"("actorId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Reconciliation_provider_date_key" ON "Reconciliation"("provider", "date");

-- CreateIndex
CREATE INDEX "Pocket_userId_idx" ON "Pocket"("userId");

-- CreateIndex
CREATE INDEX "Pocket_isActive_type_idx" ON "Pocket"("isActive", "type");

-- CreateIndex
CREATE INDEX "Pocket_status_lastAccruedAt_idx" ON "Pocket"("status", "lastAccruedAt");

-- CreateIndex
CREATE INDEX "Transaction_senderId_idx" ON "Transaction"("senderId");

-- CreateIndex
CREATE INDEX "Transaction_status_createdAt_idx" ON "Transaction"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_provider_externalReference_key" ON "Transaction"("provider", "externalReference");

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavouriteTag" ADD CONSTRAINT "FavouriteTag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pocket" ADD CONSTRAINT "Pocket_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductRate" ADD CONSTRAINT "ProductRate_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterestAccrual" ADD CONSTRAINT "InterestAccrual_pocketId_fkey" FOREIGN KEY ("pocketId") REFERENCES "Pocket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterestAccrual" ADD CONSTRAINT "InterestAccrual_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyBalanceSnapshot" ADD CONSTRAINT "DailyBalanceSnapshot_pocketId_fkey" FOREIGN KEY ("pocketId") REFERENCES "Pocket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerAccount" ADD CONSTRAINT "LedgerAccount_pocketId_fkey" FOREIGN KEY ("pocketId") REFERENCES "Pocket"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "LedgerAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- ============================================================================
-- Integrity constraints (not expressible in Prisma schema)
-- ============================================================================

-- Balances can never go negative
ALTER TABLE "Pocket" ADD CONSTRAINT "Pocket_balance_non_negative" CHECK ("balance" >= 0);

-- Amounts must be positive
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_amount_positive" CHECK ("amount" > 0);
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_amount_positive" CHECK ("amount" > 0);

-- Sane interest rates (0% - 100% p.a.)
ALTER TABLE "ProductRate" ADD CONSTRAINT "ProductRate_rate_range" CHECK ("annualRate" >= 0 AND "annualRate" <= 1);

-- USER_POCKET accounts must reference a pocket; system accounts must not
ALTER TABLE "LedgerAccount" ADD CONSTRAINT "LedgerAccount_pocket_matches_type"
  CHECK (("type" = 'USER_POCKET') = ("pocketId" IS NOT NULL));

-- Ledger entries are immutable: no UPDATE / DELETE (post a reversal instead)
CREATE OR REPLACE FUNCTION ledger_entry_immutable() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'LedgerEntry rows are immutable (% not allowed)', TG_OP;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "LedgerEntry_immutable"
  BEFORE UPDATE OR DELETE ON "LedgerEntry"
  FOR EACH ROW EXECUTE FUNCTION ledger_entry_immutable();

-- Every transaction must balance: sum(DEBIT) = sum(CREDIT). Checked at COMMIT,
-- so all legs can be inserted in any order inside one DB transaction.
CREATE OR REPLACE FUNCTION ledger_transaction_balanced() RETURNS trigger AS $$
DECLARE
  diff NUMERIC;
BEGIN
  SELECT COALESCE(SUM(CASE WHEN "direction" = 'DEBIT' THEN "amount" ELSE -"amount" END), 0)
    INTO diff
    FROM "LedgerEntry"
   WHERE "transactionId" = NEW."transactionId";

  IF diff <> 0 THEN
    RAISE EXCEPTION 'Unbalanced ledger transaction % (debits - credits = %)', NEW."transactionId", diff;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER "LedgerEntry_balanced"
  AFTER INSERT ON "LedgerEntry"
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE FUNCTION ledger_transaction_balanced();
