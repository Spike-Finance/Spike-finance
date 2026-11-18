/*
  Warnings:

  - A unique constraint covering the columns `[userId,deviceId]` on the table `UserDevice` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "DeviceType" ADD VALUE 'WEB';

-- AlterTable
ALTER TABLE "UserDevice" ADD COLUMN     "ip" TEXT,
ADD COLUMN     "location" TEXT;

-- CreateTable
CREATE TABLE "Waitlist" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Waitlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Waitlist_email_key" ON "Waitlist"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserDevice_userId_deviceId_key" ON "UserDevice"("userId", "deviceId");
