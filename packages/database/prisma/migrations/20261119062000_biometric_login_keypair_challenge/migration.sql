-- AlterTable
ALTER TABLE "UserDevice"
ADD COLUMN "biometricPublicKey" TEXT,
ADD COLUMN "biometricEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "biometricKeyAlgorithm" TEXT,
ADD COLUMN "biometricEnrolledAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "BiometricChallenge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userDeviceId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "challenge" TEXT NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BiometricChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserDevice_deviceId_biometricEnabled_isDeleted_idx" ON "UserDevice"("deviceId", "biometricEnabled", "isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "BiometricChallenge_challenge_key" ON "BiometricChallenge"("challenge");

-- CreateIndex
CREATE INDEX "BiometricChallenge_userId_deviceId_isUsed_idx" ON "BiometricChallenge"("userId", "deviceId", "isUsed");

-- CreateIndex
CREATE INDEX "BiometricChallenge_expiresAt_idx" ON "BiometricChallenge"("expiresAt");

-- AddForeignKey
ALTER TABLE "BiometricChallenge" ADD CONSTRAINT "BiometricChallenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiometricChallenge" ADD CONSTRAINT "BiometricChallenge_userDeviceId_fkey" FOREIGN KEY ("userDeviceId") REFERENCES "UserDevice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
