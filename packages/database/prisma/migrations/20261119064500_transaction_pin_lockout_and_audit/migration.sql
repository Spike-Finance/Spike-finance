-- AlterTable
ALTER TABLE "User"
ADD COLUMN "pinFailedAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "pinLockedUntil" TIMESTAMP(3),
ADD COLUMN "pinRequiresRecovery" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "pinLockoutCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "lastPinFailedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "AuditLog_action_createdAt_idx" ON "AuditLog"("action", "createdAt");
