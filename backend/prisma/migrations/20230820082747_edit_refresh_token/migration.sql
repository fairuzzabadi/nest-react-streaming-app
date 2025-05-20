/*
  Warnings:

  - You are about to drop the column `userId` on the `RefreshToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ipAddress,userAgent,email]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "userId",
ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_ipAddress_userAgent_email_key" ON "RefreshToken"("ipAddress", "userAgent", "email");
