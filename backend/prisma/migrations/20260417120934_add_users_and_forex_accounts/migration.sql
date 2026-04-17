/*
  Warnings:

  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "role" TEXT,
ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "ForexAccount" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currencyPair" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "kycStatus" TEXT NOT NULL DEFAULT 'valid',
    "kycDocType" TEXT,
    "kycExpiry" TIMESTAMP(3),
    "statementStatus" TEXT,
    "statementSubmittedAt" TIMESTAMP(3),
    "repeatOf" TEXT,
    "repeatReason" TEXT,
    "assignedAgentId" INTEGER,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ForexAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ForexAccount_email_key" ON "ForexAccount"("email");

-- AddForeignKey
ALTER TABLE "ForexAccount" ADD CONSTRAINT "ForexAccount_assignedAgentId_fkey" FOREIGN KEY ("assignedAgentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
