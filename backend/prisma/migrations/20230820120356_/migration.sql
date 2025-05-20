/*
  Warnings:

  - A unique constraint covering the columns `[ipAddress,userAgent,email]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_ipAddress_userAgent_email_key" ON "RefreshToken"("ipAddress", "userAgent", "email");
